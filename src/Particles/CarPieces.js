import { TweenMax } from "gsap";
import { BoxGeometry, Group, Mesh, MeshPhongMaterial } from "three";

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
  bloodMat = new MeshPhongMaterial({
    color: 0xff0000,
    flatShading: true,
  });
  mesh = new Group();
  constructor() {
    const bigParticleGeom = new BoxGeometry(size, size, 0.1, 1);
    this.parts = [];
    for (let i = 0; i < 60; i++) {
      const partPink = new Mesh(bigParticleGeom, this.bloodMat);
      this.parts.push(partPink);
      this.mesh.add(partPink);
    }
  }

  run = (car) => {
    const explosionSpeed = 0.3;

    const removeParticle = (p) => {
      p.visible = false;
    };

    for (let i = 0; i < this.parts.length; i++) {
      //   let m = direction < 0 ? -1 : 1;

      let tx = Math.random() * 1 + 0.5;
      let ty = -Math.random() * 0.5 + 0.5;
      let tz = -Math.random() * 2.0 + 1;
      let p = this.parts[i];

      const carColorScheme = carColors[car.carTypeId];
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

      p.position.set(0, 0, 0);
      p.scale.set(1, 1, 1);
      p.visible = true;
      let delay = explosionSpeed + Math.random() * 0.5;

      TweenMax.to(p.position, delay * 2, {
        bezier,
        // ease: Bounce.easeOut,
      });

      // TweenMax.to(p.rotation, delay * 3, {
      //   //z: Math.random() * (Math.PI * 2) + 0.2,
      //   //x: Math.random() * (Math.PI * 2) + 0.2,
      //   //y: Math.random() * (Math.PI * 2) + 0.2,
      //   delay,
      // });
      //
      //   const scaleTo = 0.01;
      //   TweenMax.to(p.scale, delay, {
      //     x: scaleTo,
      //     y: scaleTo,
      //     z: scaleTo,
      //     onComplete: removeParticle,
      //     onCompleteParams: [p],
      //     delay: delay * 3,
      //   });
    }
  };
}
