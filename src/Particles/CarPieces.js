import { TweenMax } from "gsap";
import { BoxGeometry, Group, Mesh, MeshPhongMaterial } from "three";
import CrossyTextureLoader from "../utils/TextureLoader";

const size = 0.1;

const carColors = {
  0: {
    prob: 0.7,
    primary: { r: 0.35, g: 0.53, b: 0.95 },
    second: { r: 1, g: 1, b: 1 },
  },

  1: {
    prob: 0.8,
    primary: { r: 0.28, g: 0.79, b: 0.9 },
    second: { r: 1, g: 1, b: 1 },
  },

  2: {
    prob: 0.5,
    primary: { r: 1, g: 1, b: 1 },
    second: { r: 0.05, g: 0.38, b: 0.45 },
  },

  3: {
    prob: 0.8,
    primary: { r: 0.41, g: 0.85, b: 0.31 },
    second: { r: 1, g: 1, b: 1 },
  },

  4: {
    prob: 0.8,
    primary: { r: 0.79, g: 0.33, g: 0.13 },
    second: { r: 1, g: 1, b: 1 },
  },

  5: {
    prob: 0.8,
    primary: { r: 0.51, g: 0.08, b: 0.7 },
    second: { r: 1, g: 1, b: 1 },
  },

  6: {
    prob: 0.7,
    primary: { r: 0.65, g: 0.19, b: 0.14 },
    second: { r: 1, g: 1, b: 1 },
  },

  7: {
    prob: 0.8,
    primary: { r: 0.88, g: 0.8, b: 0.11 },
    second: { r: 0.62, g: 0.61, b: 0.59 },
  },

  8: {
    prob: 0.9,
    primary: { r: 1, g: 1, b: 1 },
    second: { r: 0.35, g: 0.53, b: 0.95 },
  },
};

export default class CarPiece {
  mesh = new Group();
  constructor() {
    const bigParticleGeom = new BoxGeometry(size, size, 0.1, 1);
    this.parts = [];
    this.n = 6;
    for (let i = 0; i < this.n; i++) {
      const material = new MeshPhongMaterial({
        color: 0xff0000, // Or randomize color here
        flatShading: true,
      });
      const partPink = new Mesh(bigParticleGeom, material);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }

    // New feature - Fire & Smoke on cars' shattered pieces
  }

  run = (car) => {
    const explosionSpeed = 0.3;

    const removeParticle = (p) => {
      p.visible = false;
    };
    const carColorScheme = carColors[car.carTypeId];

    for (let i = 0; i < this.parts.length; i++) {
      let dx = Math.random() < 0.5 ? -1 : 1;
      let dz = Math.random() < 0.5 ? -1 : 1;

      let tx = dx * (Math.random() * 1 + 0.5);
      let ty = -Math.random() * 0.5 + 0.5;
      let tz = dz * (Math.random() * 2.0 + 1);
      let p = this.parts[i];

      p.material.color =
        Math.random() < carColorScheme.prob
          ? carColorScheme.primary
          : carColorScheme.second;
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

      let sx = Math.random() * 2 + 1;
      let sy = Math.random() + 1;
      let sz = Math.random() * 2 + 1;

      p.position.set(0, 0, 0);
      p.scale.set(sx, sy, sz);
      p.visible = true;

      TweenMax.to(p.position, 0.5, {
        bezier,
        // ease: Bounce.easeOut,
      });

      TweenMax.to(p.rotation, 0.5, {
        y: Math.random() * (Math.PI * 2) + 0.2,
      });

      const scaleTo = 0.01;
      TweenMax.to(p.scale, 0.5, {
        x: scaleTo,
        y: scaleTo,
        z: scaleTo,
        onComplete: removeParticle,
        onCompleteParams: [p],
        delay: 5,
      });
    }
  };
}
