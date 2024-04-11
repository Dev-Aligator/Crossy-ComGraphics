import Generic from "./Generic";

const itemsList = [
    'bomb',
]
export default class Item extends Generic {
    setup = async () => {
        const { items } = this.globalModels;

        for (let index in itemsList) {
            let item = itemsList[index];
            await this._register(`${index}`, {
                ...items[item],
                castShadow: true,
                receiveShadow: true,
            });
        }
        return this.models
    };
}