import { Group } from "three";
import { utils } from "expo-three";
import { TimelineMax } from "gsap/TweenMax";
import {
  BASE_ANIMATION_TIME,
  groundLevel,
  IDLE_DURING_GAME_PLAY,
  PLAYER_IDLE_SCALE,
  startingRow,
} from "./GameSettings";
import ModelLoader from "../src/ModelLoader";
import { Box3, Mesh } from "three";
import { PlayerScaleAnimation, PlayerIdleAnimation, PlayerPositionAnimation, ItemPositionAnimation } from "./Animations";
const normalizeAngle = (angle) => {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
};


export default class CrossyPlayer extends Group {
  animations = [];

  _character;

  setCharacter(character) {
    if (this._character === character) return;
    this._character = character;
    const node = ModelLoader._hero.getNode(character);
    if (!node)
      throw new Error(`Failed to get node for character: ${character}`);
    if (this.node) {
      this.remove(this.node);
    }

    utils.scaleLongestSideToSize(node, 1);
    utils.alignMesh(node, { x: 0.5, z: 0.5, y: 1.0 });
    this.node = node;
    this.add(node);
    this.carriedItem = null;
    this.height = this.getHeight(node);
    this.width = this.getWidth(node)
  }

  constructor(character) {
    super();
    this.setCharacter(character);
    this.reset();
    this.scene_world = null;
  }

  dropItem() {
    if (this.carriedItem) {
      this.scene_world.remove(this.carriedItem.mesh);
      this.carriedItem = null;
    }
  }
  getHeight = (mesh) => {
    let box3 = new Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.y - box3.min.y);
  }

  getWidth = (mesh) => {
    let box3 = new Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.x - box3.min.x);
  }

  moveOnEntity() {
    if (!this.ridingOn) {
      return;
    }

    // let target = this._hero.ridingOn.mesh.position.x + this._hero.ridingOnOffset;
    this.position.x += this.ridingOn.speed;
    this.initialPosition.x = this.position.x;

    if (this.carriedItem) {
      this.carriedItem.mesh.position.x += this.ridingOn.speed;
    }
  }

  moveOnCar() {
    if (!this.hitBy) {
      return;
    }

    let target = this.hitBy.mesh.position.x;
    this.position.x += this.hitBy.speed;
    if (this.initialPosition) this.initialPosition.x = target;
  }


  stopAnimations() {
    this.animations.map(val => {
      if (val && val.pause) {
        val.pause();
      }
      val = null;
    });
    this.animations = [];
  }

  reset() {
    this.position.set(0, groundLevel, startingRow);
    this.scale.set(1, 1, 1);
    this.rotation.set(0, Math.PI, 0);

    this.initialPosition = null;
    this.targetPosition = null;
    this.moving = false;
    this.hitBy = null;
    this.ridingOn = null;
    this.ridingOnOffset = null;
    this.isAlive = true;
  }

  skipPendingMovement() {
    if (!this.moving) {
      return;
    }
    this.position.set(
      this.targetPosition.x,
      this.targetPosition.y,
      this.targetPosition.z
    );
    if (this.targetRotation) {
      this.rotation.y = normalizeAngle(this.targetRotation);
    }
    // return
  }

  finishedMovingAnimation() {
    this.moving = false;
    if (IDLE_DURING_GAME_PLAY) {
      if (this.idleAnimation) {
        this.idleAnimation.play();
      } else {
        this.idle();
      }
    }
    this.lastPosition = this.position;

    // this._hero.position.set(Math.round(this._hero.position.x), this._hero.position.y, Math.round(this._hero.position.z))
  }

  stopIdle() {
    if (this.idleAnimation && this.idleAnimation.pause) {
      this.idleAnimation.pause();
    }
    this.idleAnimation = null;
    this.scale.set(1, 1, 1);
  }

  idle() {
    if (this.idleAnimation) {
      return;
    }
    this.stopIdle();

    this.idleAnimation = new PlayerIdleAnimation(this);
  }

  createPositionAnimation({ onComplete }) {
    return new PlayerPositionAnimation(this, {
      onComplete: () => {
        this.finishedMovingAnimation();
        onComplete();
      },
      targetPosition: this.targetPosition,
      initialPosition: this.initialPosition,
    });
  }

  createItemPositionAnimation({ onComplete }) {
    if (!this.carriedItem) {
      return;
    }
    return new ItemPositionAnimation(this.carriedItem.mesh, this.height, {
      onComplete: () => {
        // this.finishedMovingAnimation();
        onComplete();
      },
      targetPosition: this.targetPosition,
      initialPosition: this.initialPosition,
    });
  }

  commitMovementAnimations({ onComplete }) {
    const positionChangeAnimation = this.createPositionAnimation({
      onComplete,
    });

    const itemChangeAnimation = this.createItemPositionAnimation({
      onComplete,
    });

    this.animations = [
      positionChangeAnimation,
      itemChangeAnimation,
      new PlayerScaleAnimation(this),
      TweenMax.to(this.rotation, BASE_ANIMATION_TIME, {
        y: this.targetRotation,
        ease: Power1.easeInOut,
        // Reset angle when finished
        onComplete: () => (this.rotation.y = normalizeAngle(this.rotation.y)),
      }),
    ];

    this.initialPosition = this.targetPosition;
  }

  runPosieAnimation() {
    this.stopIdle();

    TweenMax.to(this.scale, 0.2, {
      x: 1.2,
      y: 0.75,
      z: 1,
      // ease: Bounce.easeOut,
    });
  }

  hitBy = null;
  moving = false;

  collideWithCar(road, car) {
    if (
      this.moving &&
      Math.abs(this.position.z - Math.round(this.position.z)) > 0.1
    ) {
      this.getHitByCar(road, car);
    } else {
      this.getRunOverByCar(road, car);
    }
  }

  getRunOverByCar(road, car) {
    this.position.y = road.top - 0.05;

    TweenLite.to(this.scale, 0.2, {
      y: 0.05,
      x: 1.7,
      z: 1.7,
    });
    TweenMax.to(this.rotation, 0.2, {
      y: Math.random() * Math.PI - Math.PI / 2,
    });
  }

  getHitByCar(road, car) {
    this.hitBy = car;

    const forward = this.position.z - Math.round(this.position.z) > 0;
    this.position.z = road.position.z + (forward ? 0.52 : -0.52);

    TweenLite.to(this.scale, 0.15, {
      y: 1.5,
      z: 0.2,
    });
    TweenMax.to(this.rotation, 0.15, {
      z: Math.random() * Math.PI - Math.PI / 2,
    });
  }
}
