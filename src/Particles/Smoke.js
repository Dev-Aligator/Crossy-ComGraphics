import { TweenMax } from "gsap";
import {
  BoxGeometry,
  SphereGeometry,
  Group,
  Mesh,
  LinearFilter,
  MeshPhongMaterial,
  MeshBasicMaterial,
  PlaneGeometry,
  TextureLoader,
  CustomBlending,
  AddEquation,
  OneFactor,
  OneMinusSrcAlphaFactor,
} from "three";
import textureImage from "../../assets/particles/smoke_dark.png";
import { explosionDuration } from "../GameSettings";
import { GetLength } from "../utils/ThreeUtils";
export default class Smoke {
  constructor() {
    const textureLoader = new TextureLoader();

    const texture = textureLoader.load(textureImage);
    texture.generateMipmaps = false;
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;
    texture.premultiplyAlpha = true;

    this.fireMat = new MeshPhongMaterial({
      map: texture,
      transparent: true,
      // opacity: 0.95,
      depthWrite: false,
      // color: 0x000000,
      // blending: CustomBlending,
      // blendEquation: AddEquation,
      // blendSrc: OneFactor,
      // blendDst: OneMinusSrcAlphaFactor,
      // blendSrcAlpha: OneFactor,
      // blendDstAlpha: OneMinusSrcAlphaFactor,
    });
    this.mesh = new Group();
    const size = 1;
    this.parts = [];
    let particleGeom = new BoxGeometry(size, size, 0.001, 1);
    for (let i = 0; i < 20; i++) {
      let partPink = new Mesh(particleGeom, this.fireMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }
  }

  run = (car, onComplete) => {
    let explosionSpeed = 0.3;

    for (let i = 0; i < this.parts.length; i++) {
      // let m = direction < 0 ? -1 : 1;
      let tx = Math.random() * 1 - 0.5;
      let ty = Math.random() * 0.5 + 0.5;
      let tz = Math.random() * 0.4 - 0.2;
      let p = this.parts[i];

      const bezier = {
        type: "cubic",
        values: [
          { x: 0, y: 0, z: 0 },
          { x: tx * 0.25, y: ty * 0.25, z: tz * 0.25 },
          { x: tx * 0.5, y: ty * 0.5, z: tz * 0.5 },

          { x: tx, y: ty, z: tz },
        ],
        curviness: 3,
      };

      p.position.set(0, 0, 0);
      p.scale.set(1, 1, 1);
      p.visible = true;

      TweenMax.to(p.position, explosionSpeed * 3, {
        bezier,
      });

      const scaleTo = GetLength(car.mesh);
      TweenMax.to(p.scale, explosionSpeed, {
        x: scaleTo,
        y: scaleTo,
        z: scaleTo,
        onComplete: () => {
          TweenMax.to(p.scale, 2, {
            x: 0,
            y: 0,
            z: 0,
          });
        },
      });
    }

    setTimeout(onComplete, (explosionDuration - 0.1) * 1000);
  };
}
