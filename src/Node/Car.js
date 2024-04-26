import Generic from './Generic';

const cars = [
  { name: 'police_car', scale: 0 },
  { name: 'blue_car', scale: 0 },
  { name: 'blue_truck', scale: 0 },
  { name: 'green_car', scale: 0 },
  { name: 'orange_car', scale: 0 },
  { name: 'purple_car', scale: 0 },
  { name: 'red_truck', scale: 0 },
  { name: 'taxi', scale: 0 },
  { name: 'bus_uit', scale: 2.4 },
];


export default class Car extends Generic {
  setup = async () => {
    const { vehicles } = this.globalModels;

    for (let index in cars) {
      let car = cars[index];
      await this._register(`${index}`, {
        ...vehicles[car.name],
        castShadow: true,
        receiveShadow: true,
        scale: car.scale,
      });
    }

    return this.models;
  };
}
