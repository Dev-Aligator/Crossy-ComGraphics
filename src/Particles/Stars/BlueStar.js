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
import textureImage from "../../../assets/particles/blue_star.png";
import { GetHeight, GetLength, GetWidth } from "../../utils/ThreeUtils";
import CrossyTextureLoader from "../../utils/TextureLoader";
export default class BlueStar {
  constructor() {
    const textureLoader = new CrossyTextureLoader();
    const texture = textureLoader.loadTexture(textureImage);

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
    const size = 0.25;
    this.parts = [];
    let particleGeom = new BoxGeometry(size, size, 0.0001, 1);
    for (let i = 0; i < 7; i++) {
      let partPink = new Mesh(particleGeom, this.fireMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }
  }

  run = () => {
    for (let i = 0; i < this.parts.length; i++) {
      let flyingSpeed = Math.random() + 1;

      setInterval(() => {
        let px = Math.random() * 0.5 - 0.25;
        let ty = 0.6;
        let pz = Math.random() * 0.4 - 0.2;

        let p = this.parts[i];

        const bezier = {
          type: "cubic",
          values: [
            { x: px, y: 0, z: pz },
            { x: px, y: ty * 0.25, z: pz },
            { x: px, y: ty * 0.5, z: pz },

            { x: px, y: ty, z: pz },
          ],
          curviness: 3,
        };

        let scaleTo = 0.5 + Math.random() * 0.5;

        p.position.set(px, 0, pz);
        p.scale.set(scaleTo, scaleTo, scaleTo);
        p.visible = true;

        TweenMax.to(p.position, flyingSpeed * 3, {
          bezier,
          onComplete: () => {
            TweenMax.to(p.scale, 500, {
              x: 0.1,
              y: 0.1,
              z: 0.1,
            });
          },
        });
      }, flyingSpeed * 1000 + 500);
    }
  };
}
