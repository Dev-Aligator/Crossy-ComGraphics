import { Box3, Object3D, BoxGeometry, MeshBasicMaterial, Mesh } from "three";
import { utils } from "expo-three";
import ModelLoader from "../../src/ModelLoader";
import {
  groundLevel,
  itemGenerationRate,
  DISABLE_ITEMS,
} from "../GameSettings";
import { Power2, TweenMax } from "gsap";
import ItemList from "../Items";
export const Fill = {
  empty: "empty",
  solid: "solid",
  random: "random",
};

import BlueStar from "../Particles/Stars/BlueStar";
import PurpleStar from "../Particles/Stars/PurpleStar";
import { ScaleMeshWidthToSize } from "../utils/ThreeUtils";

const HAS_WALLS = true;
const HAS_OBSTACLES = true;
const HAS_VARIETY = true;

export default class Grass extends Object3D {
  active = false;
  entities = [];
  itemNames = Object.keys(ItemList);

  top = 0.4;
  /*

* Build Walls

* Random Fill Center
* Solid Fill Center
* Empty Fill Center


*/
  getWidth = (mesh) => {
    let box3 = new Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.z - box3.min.z);
  };

  generate = (type = Fill.random) => {
    this.entities.map((val) => {
      this.floor.remove(val.mesh);
      val = null;
    });
    this.entities = [];
    this.obstacleMap = {};
    this.treeGen(type);

    this.itemList = [];

    if (!DISABLE_ITEMS) {
      this.itemGen();
    }
  };

  obstacleMap = {};
  addObstacle = (x) => {
    let mesh;
    if (HAS_VARIETY) {
      mesh =
        Math.random() < 0.4
          ? ModelLoader._boulder.getRandom()
          : ModelLoader._tree.getRandom();
    } else {
      mesh = ModelLoader._tree.getRandom();
    }
    this.obstacleMap[`${x | 0}`] = { index: this.entities.length };
    this.entities.push({ mesh });
    this.floor.add(mesh);
    mesh.position.set(x, groundLevel, 0);
  };

  treeGen = (type) => {
    // 0 - 8
    let _rowCount = 0;
    const count = Math.round(Math.random() * 2) + 1;
    for (let x = -3; x < 12; x++) {
      const _x = x - 4;
      if (type === Fill.solid) {
        this.addObstacle(_x);
        continue;
      }

      if (HAS_WALLS) {
        /// Walls
        if (x >= 9 || x <= -1) {
          this.addObstacle(_x);
          continue;
        }
      }

      if (HAS_OBSTACLES) {
        if (_rowCount < count) {
          if (_x !== 0 && Math.random() > 0.6) {
            this.addObstacle(_x);
            _rowCount++;
          }
        }
      }
    }
  };

  itemGen = () => {
    if (Math.random() <= itemGenerationRate) {
      let itemPosX = Math.floor(Math.random() * 15) - 3;

      if (itemPosX in this.obstacleMap) {
        return;
      }

      let randomItem;

      const randomRoulette = Math.random();
      let accumulatedRate = 0;
      for (let i = 0; i < this.itemNames.length; i++) {
        accumulatedRate += ItemList[this.itemNames[i]].rate;
        if (randomRoulette <= accumulatedRate) {
          randomItem = ItemList[this.itemNames[i]];
          break;
        }
      }
      let mesh = ModelLoader._item.getNode(randomItem.id);
      ScaleMeshWidthToSize(mesh, randomItem.scaleGround);
      utils.alignMesh(mesh, { x: 0.5, z: 1, y: 0.5 });
      const width = this.getWidth(mesh);

      this.floor.add(mesh);
      mesh.position.set(itemPosX - randomItem.alignOffset, groundLevel, 0);
      mesh.rotation.y = randomItem.rotateY;

      if (randomItem.effect) {
        this.constructItemEffect(itemPosX);
      }
      this.itemList.push({
        mesh,
        width,
        id: randomItem.id,
        timeOut: randomItem.timeOut,
        scalePlayer: randomItem.scalePlayer,
        activeTime: randomItem.activeTime,
        itemFunction: randomItem.itemFunction,
        itemWhileCarrying: randomItem.whileCarrying,
        spinSpeedWhileCarrying: randomItem.spinSpeedWhileCarrying,
      });

      const tl = new TimelineMax();

      // Add a delay of 2 seconds before starting the animation
      tl.to({}, 2, {});

      // Floating animation
      tl.to(mesh.position, 1, { y: "+=0.1", ease: Power1.easeInOut }, "-=1") // Up
        .to(mesh.position, 1, { y: "-=0.1", ease: Power1.easeInOut }) // Down
        .repeat(-1); // Repeat infinitely

      // Start the timeline
      tl.play();
    }
  };

  constructItemEffect = (itemPosX) => {
    // Blur Star Effect
    this.blueStar = new BlueStar();
    this.floor.add(this.blueStar.mesh);
    this.blueStar.mesh.position.set(itemPosX, groundLevel, 0);
    this.blueStar.run();

    // Purple Star Effect
    this.purpleStar = new PurpleStar();
    this.floor.add(this.purpleStar.mesh);
    this.purpleStar.mesh.position.set(itemPosX, groundLevel, 0);
    this.purpleStar.run();
  };

  destroyItemEffect = (itemMesh) => {
    if (itemMesh) {
      this.floor.remove(itemMesh);
    }
    if (this.blueStar) {
      this.floor.remove(this.blueStar.mesh);
      this.blueStar = null;
    }

    if (this.purpleStar) {
      this.floor.remove(this.purpleStar.mesh);
      this.purpleStar = null;
    }
  };

  constructor(heroWidth, onCollide) {
    super();
    this.onCollide = onCollide;
    const { _grass } = ModelLoader;

    this.floor = _grass.getNode();
    this.add(this.floor);
  }
}
