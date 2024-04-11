import { Box3, Object3D } from 'three';
import { utils } from 'expo-three';
import ModelLoader from '../../src/ModelLoader';
import { groundLevel } from '../GameSettings';
import { Power2, TweenMax } from 'gsap';
export const Fill = {
  empty: 'empty',
  solid: 'solid',
  random: 'random',
};

const HAS_WALLS = true;
const HAS_OBSTACLES = true;
const HAS_VARIETY = true;

export default class Grass extends Object3D {
  active = false;
  entities = [];

  top = 0.4;
  /*

* Build Walls

* Random Fill Center
* Solid Fill Center
* Empty Fill Center


*/
  getWidth = mesh => {
    let box3 = new Box3();
    box3.setFromObject(mesh);
    // console.log( box.min, box.max, box.size() );
    return Math.round(box3.max.z - box3.min.z);
  };

  generate = (type = Fill.random) => {
    this.entities.map(val => {
      this.floor.remove(val.mesh);
      val = null;
    });
    this.entities = [];
    this.obstacleMap = {};
    this.treeGen(type);

    this.itemList = [];
    // this.itemMap = {};
    this.itemGen()
  };

  obstacleMap = {};
  addObstacle = x => {
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

  treeGen = type => {
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
    // this.items.map(val => {
    //   this.floor.remove(val.mesh);
    //   val = null;
    // });
    // this.items = [];

    if (Math.random() > 0.1) {
      let itemPosX = Math.floor(Math.random()*15) - 3

      if (itemPosX in this.obstacleMap) {
        return;
      }

      let mesh = ModelLoader._item.getRandom();
      utils.scaleLongestSideToSize(mesh, 0.5);
      const width = this.getWidth(mesh);

      this.floor.add(mesh);
      mesh.position.set(itemPosX, groundLevel + 0.05 , 0);
      
      TweenMax.to(mesh.rotation, 2, { 
        y: Math.PI * 2,
        repeat: -1,
        repeatDelay: 0,
        ease: Linear.easeNone
       });

      //  this.itemMap[`${x | 0}`] = { index: this.entities.length };
       this.itemList.push({
        mesh,
        width,
       })

    }
    
  }

  constructor(heroWidth, onCollide) {
    super();
    this.onCollide = onCollide;
    const { _grass } = ModelLoader;

    this.floor = _grass.getNode();
    this.add(this.floor);
  }
}
