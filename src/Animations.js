import { TimelineMax } from 'gsap/TweenMax';
import { BASE_ANIMATION_TIME } from './GameSettings';

export class ExplosionAnimation extends TimelineMax {
    constructor(explosion, onCompleteExplosion) {
        super({
            onComplete: () => onCompleteExplosion(),
        });

        this.to(explosion.scale, 0.5, {
            x: 0.15,
            y: 0.15,
            z: 0.1,
        })
         .to(explosion.scale, 0.3, {
            x: 0.01,
            y:0.1,
            z:0.01,
         })
    }
}