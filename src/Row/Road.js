import { Box3, Object3D } from "three";

import ModelLoader from "../../src/ModelLoader";
import { utils } from "expo-three";
import { groundLevel } from "../GameSettings";
import { TweenMax } from "gsap";
import { CarSkaingAnimation } from "../Animations";

export default class Road extends Object3D {
  active = false;
  cars = [];
  top = 0.3;
  explosionBox = 3;

  isFirstLane(isFirst) {
    if (isFirst) {
      this.road.material = ModelLoader._road.models["1"].children[0].material;
    } else {
      this.road.material = ModelLoader._road.models["0"].children[0].material;
    }
  }

  getWidth = (mesh) => {
    let box3 = new Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.z - box3.min.z);
  };

  carGen = () => {
    this.cars.map((val) => {
      this.road.remove(val.mesh);
      val = null;
    });
    this.cars = [];

    // Speeds: .01 through .08
    // Number of cars: 1 through 3
    let speed = Math.random() * 0.06 + 0.02;
    let numCars = Math.floor(Math.random() * 2) + 1;
    let xDir = 1;

    if (Math.random() > 0.5) {
      xDir = -1;
    }

    let xPos = -6 * xDir;

    for (let x = 0; x < numCars; x++) {
      if (this.cars.length - 1 < x) {
        // let mesh = ModelLoader._car.getRandom();
        // let mesh = ModelLoader._car.getNode("8");
        const randomRoulette = Math.random();
        let accumulatedrate = 0;
        for (let i = 0; i < ModelLoader._car.getTotalKey(); i++) {
          accumulatedrate += ModelLoader._carRate[i].rate;
          if (randomRoulette <= accumulatedrate) {
            var carTypeId = ModelLoader._carRate[i].id;
            break;
          }
        }
        let carTypeId =
          Math.random() > 0.5 ? "8" : ModelLoader._car.getRandomKey();
        let mesh = ModelLoader._car.getNode(carTypeId);
        const width = this.getWidth(mesh);

        this.cars.push({
          mesh,
          carTypeId: carTypeId,
          dir: xDir,
          width,
          collisionBox: this.heroWidth / 2 + width / 2 - 0.1,
          isTargeted: false,
          isDestroyed: false,
        });

        this.road.add(mesh);
      }

      this.cars[x].mesh.position.set(xPos, 0.25, 0);
      this.cars[x].speed = speed * xDir;
      this.cars[x].mesh.rotation.y = (Math.PI / 2) * xDir;

      xPos -= (Math.random() * 3 + 5) * xDir;
    }
  };

  constructor(heroWidth, onCollide) {
    super();
    this.heroWidth = heroWidth;
    this.onCollide = onCollide;
    const { _road } = ModelLoader;

    this.road = _road.models["1"].children[0].clone();
    this.add(this.road);

    this.carGen();
  }

  update = (dt, player) => {
    if (!this.active) {
      return;
    }
    this.cars.map((car) => this.drive({ dt, player, car }));
  };

  removeCar = (car) => {
    const carIndex = this.cars.indexOf(car);
    if (carIndex > -1) {
      this.cars.splice(this.cars.indexOf(car), 1);
    }
    if (this.cars.length == 0 && this.active) {
      this.carGen();
    }
  };

  drive = ({ dt, player, car }) => {
    const { hitBy } = player;
    const offset = 11;

    car.mesh.position.x += car.speed;

    if (car.mesh.position.x > offset && car.speed > 0) {
      car.mesh.position.x = -offset;
      if (car === hitBy) {
        player.hitBy = null;
      }
    } else if (car.mesh.position.x < -offset && car.speed < 0) {
      car.mesh.position.x = offset;
      if (car === hitBy) {
        player.hitBy = null;
      }
    } else {
      if (Math.abs(player.position.z - this.position.z) <= 1) {
        this.shouldCheckExplosion({ player, car });
      }
      this.shouldCheckCollision({ player, car });
    }
  };

  explosionTrigger = (car, player, predictedPosX) => {
    const onCompleteExplosion = () => {
      this.road.remove(car.mesh);
    };
    let explosionPosition = {
      x: predictedPosX,
      y: car.mesh.position.y,
      z: this.position.z,
    };
    new CarSkaingAnimation(car.mesh);
    player.scene.useParticle(
      explosionPosition,
      "explosion",
      0,
      onCompleteExplosion,
      car
    );
  };

  shouldCheckExplosion = ({ player, car }) => {
    if (
      player.isAlive &&
      !car.isTargeted &&
      player.carriedItem &&
      player.itemIsActive &&
      player.carriedItem.id == "0"
    ) {
      if (Math.abs(player.position.x - car.mesh.position.x) < 3) {
        car.isTargeted = true;
        player.itemInUse = true;
        const explosionPositionX =
          car.mesh.position.x + (0.5 * car.speed) / 0.016;
        TweenMax.to(player.carriedItem.mesh.position, 0.5, {
          x: explosionPositionX,
          y: car.mesh.position.y,
          z: this.position.z,
          onComplete: () => {
            player.dropItem();
            this.explosionTrigger(car, player, explosionPositionX);
            car.isDestroyed = true;
            this.removeCar(car);
          },
        });
      }
    }
  };

  shouldCheckCollision = ({ player, car }) => {
    if (Math.round(player.position.z) == this.position.z && player.isAlive) {
      const { mesh, collisionBox } = car;

      if (
        player.position.x < mesh.position.x + collisionBox &&
        player.position.x > mesh.position.x - collisionBox &&
        !car.isDestroyed
      ) {
        player.collideWithCar(this, car);
        this.onCollide(car, "feathers", "car");
      }
    }
  };
}
