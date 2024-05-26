export default {
  bomb: {
    id: "0",
    name: "bomb",
    rate: 0.8,
    rotateY: 0.25,
    scaleGround: 0.35,
    scalePlayer: 0.25,
    alignOffset: 0,
    timeOut: 5000,
    activeTime: 100,
    whileCarrying: "self",
    spinSpeedWhileCarrying: 1,
  },

  revive_crystal: {
    id: "1",
    name: "revive_crystal",
    rate: 0.2,
    rotateY: Math.PI,
    scaleGround: 0.45,
    scalePlayer: 0.25,
    alignOffset: 0.2,
    timeOut: 5000,
    activeTime: 100,
    effect: true,
    itemFunction: reviveFunction,
    whileCarrying: "angle_ring",
    spinSpeedWhileCarrying: 5,
  },
};

function reviveFunction(hero) {
  hero.isProtected = true;
  hero.checkpoint = hero.position.clone();
  setTimeout(() => {
    if (!hero.isProtected) {
      return;
    }
    hero.isProtected = false;
    hero.checkpoint = null;
  }, 5000);
}
