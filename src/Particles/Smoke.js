import { TweenMax } from "gsap";
import { BoxGeometry, SphereGeometry, Group, Mesh, LinearFilter, MeshPhongMaterial, MeshBasicMaterial, PlaneGeometry, TextureLoader, CustomBlending, AddEquation, OneFactor, OneMinusSrcAlphaFactor } from "three";
import textureImage from "../../assets/particles/smoke.png"; 
import { explosionDuration } from "../GameSettings";
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
    const size = 0.7;
    this.parts = [];
    let particleGeom = new BoxGeometry(size,size,0.001, 1);
    for (let i = 0; i < 20; i++) {
      let partPink = new Mesh(particleGeom, this.fireMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }
  }

  run = (type, direction) => {
    let explosionSpeed = 0.3;

    for (let i = 0; i < this.parts.length; i++) {
      // let m = direction < 0 ? -1 : 1;

      let tx = (Math.random() * 1 - 0.5);
      let ty = Math.random() * 0.5 + 0.5;
      let tz = 0;
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
      let s = explosionSpeed + Math.random() * 0.5;

      TweenMax.to(p.position, s * 5, {
        bezier,
        // ease: Bounce.easeOut,
        repeat: -1,
      });

      const scaleTo = 2;
      TweenMax.to(p.scale, s, {
        x: scaleTo,
        y: scaleTo,
        z: scaleTo,
        onComplete: () => {
          TweenMax.to(p.scale, s, {
            x: 0,
            y: 0,
            z: 0,
          })
        },
        delay: explosionDuration - 0.3,

      });
    }
  };

}
