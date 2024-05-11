import { TweenMax } from "gsap";
import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  CustomBlending,
  AddEquation,
  OneFactor,
  OneMinusSrcAlphaFactor,
} from "three";
import { GetLength } from "../utils/ThreeUtils";
import CrossyTextureLoader from "../utils/TextureLoader";
import Images from "../Images";
export default class Fire {
  constructor() {
    const textureLoader = new CrossyTextureLoader();
    const texture = textureLoader.loadTexture(Images.particle.fire);

    this.fireMat = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      // opacity: 0.95,
      depthWrite: false,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneMinusSrcAlphaFactor,
      blendSrcAlpha: OneFactor,
      blendDstAlpha: OneMinusSrcAlphaFactor,
    });
    // this.fireMat.wireframe = false;
    this.mesh = new Group();
    const size = 0.7;
    this.parts = [];
    let particleGeom = new BoxGeometry(size, size, 0.0001, 1);
    for (let i = 0; i < 20; i++) {
      let partPink = new Mesh(particleGeom, this.fireMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }
  }

  run = (car) => {
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
  };
}
