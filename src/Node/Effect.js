import Generic from "./Generic";

const effectList = [
    // 'explosion',
]

export default class Effect extends Generic {
    setup = async () => {
        const { effects } = this.globalModels;

        for (let index in effectList) {
            let effect = effectList[index];
            await this._register(`${index}`,{
                ...effects[effect],
                castShadow: true,
                receiveShadow: true,
            })
        }
        
        return this.models
    };
}
