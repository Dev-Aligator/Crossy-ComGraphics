import { TweenMax } from "gsap";
import { BoxGeometry, Group, Mesh, LinearFilter, MeshPhongMaterial, MeshBasicMaterial, PlaneGeometry, TextureLoader, CustomBlending, AddEquation, OneFactor, OneMinusSrcAlphaFactor } from "three";
import textureImage from "../../assets/particles/fire.png"; 
import { explosionDuration } from "../GameSettings";
export default class Fire {
  constructor() {
    const textureLoader = new TextureLoader();

    const texture = textureLoader.load(textureImage);
    texture.generateMipmaps = false;
    texture.magFilter = LinearFilter;
    texture.minFilter = LinearFilter;
    texture.premultiplyAlpha = true;

    this.fireMat = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      // color: 0x71d7ff,
      blending: CustomBlending,
      blendEquation: AddEquation,
      blendSrc: OneFactor,
      blendDst: OneMinusSrcAlphaFactor,
      blendSrcAlpha: OneFactor,
      blendDstAlpha: OneMinusSrcAlphaFactor,
    });
    // this.fireMat.wireframe = false;
    this.mesh = new Group();
    const size = 2;
    this.parts = [];
    let particleGeom = new BoxGeometry(size,size,0.0001, 1);
    for (let i = 0; i < 50; i++) {
      let partPink = new Mesh(particleGeom, this.fireMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }
  }

  run = (type, direction) => {
    let explosionSpeed = 0.3;

    for (let i = 0; i < this.parts.length; i++) {
      // let m = direction < 0 ? -1 : 1;
      let sx = Math.random() * 4 - 2;
      let sy = Math.random() * 1 + 1;
      let sz = Math.random() * 2 - 1;
      let p = this.parts[i];

      let px = Math.random()*0.2 + 0.2
      let py = Math.random()*1 + 1
      let pz = Math.random()*0.1 + 0.1

      // Randomize initial rotation
      let rx = Math.random() * Math.PI * 2; // Random rotation around x-axis
      let ry = Math.random() * Math.PI * 2; // Random rotation around y-axis
      let rz = Math.random() * Math.PI * 2; // Random rotation around z-axis
      // p.rotation.set(rx, ry, rz);

      p.position.set(px, py, pz);
      p.scale.set(sx, sy, sz);
      p.visible = true;
      let s = explosionSpeed + Math.random() * 0.5;

      // Randomize direction of explosion
      let dx = Math.random() * 0.2 - 0.1; // Range from -1 to 1
      let dy = Math.random() * 2 - 1; // Range from -1 to 1
      let dz = Math.random() * 0.2 - 0.1; // Range from -1 to 1

      // Tween animation for position with delay based on index
      TweenMax.to(p.position, s, {
        x: p.position.x + dx, // Adjust multiplier as needed for explosion spread
        y: p.position.y + dy, // Adjust multiplier as needed for explosion spread
        z: p.position.z + dz, // Adjust multiplier as needed for explosion spread
        ease: Power2.easeOut,
        delay: 0.05, // Delay based on index, adjust as needed
      });

      // Tween animation for scale with delay based on index
      TweenMax.to(p.scale, s * 0.5, {
        x: 0,
        y: 0,
        z: 0,
        ease: Power2.easeIn,
        delay: explosionDuration, // Delay based on index, adjust as needed
      });

      // Tween animation for rotation with delay based on index
      // TweenMax.to(p.rotation, s * 0.5, {
      //   x: rx + Math.random() * Math.PI * 4 - Math.PI * 2, // Random rotation around x-axis
      //   y: ry + Math.random() * Math.PI * 4 - Math.PI * 2, // Random rotation around y-axis
      //   z: rz + Math.random() * Math.PI * 4 - Math.PI * 2, // Random rotation around z-axis
      //   ease: Power2.easeIn,
      //   delay: s, // Delay based on index, adjust as needed
      // });
    }
  };
}
