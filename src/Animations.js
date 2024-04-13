import { TimelineMax } from 'gsap/TweenMax';
import {
    BASE_ANIMATION_TIME,
    PLAYER_IDLE_SCALE,
} from "./GameSettings";

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
                y: 0.1,
                z: 0.01,
            })
    }
}

export class ItemPickupAnimation extends TimelineMax {
    constructor(mesh, hero, onComplete) {
        super({
            onComplete: () => onComplete(),
        });

        this.to(mesh.position, 1, {
            x: 0,
            y: 5,
            z: 0,
        });

    }
}

export class PlayerScaleAnimation extends TimelineMax {
    constructor(player) {
        super();

        this.to(player.scale, BASE_ANIMATION_TIME, {
            x: 1,
            y: 1.2,
            z: 1,
        })
            .to(player.scale, BASE_ANIMATION_TIME, {
                x: 1.0,
                y: 0.8,
                z: 1,
            })
            .to(player.scale, BASE_ANIMATION_TIME, {
                x: 1,
                y: 1,
                z: 1,
                ease: Bounce.easeOut,
            });
    }
}


export class PlayerIdleAnimation extends TimelineMax {
    constructor(player) {
        super({ repeat: -1 });

        this.to(player.scale, 0.3, {
            y: PLAYER_IDLE_SCALE,
            ease: Power1.easeIn,
        }).to(player.scale, 0.3, { y: 1, ease: Power1.easeOut });
    }
}


export class PlayerPositionAnimation extends TimelineMax {
    constructor(player, { targetPosition, initialPosition, onComplete }) {
        super({
            onComplete: () => onComplete(),
        });

        const delta = {
            x: targetPosition.x - initialPosition.x,
            z: targetPosition.z - initialPosition.z,
        };

        const inAirPosition = {
            x: initialPosition.x + delta.x * 0.75,
            y: targetPosition.y + 0.5,
            z: initialPosition.z + delta.z * 0.75,
        };

        this.to(player.position, BASE_ANIMATION_TIME, { ...inAirPosition }).to(
            player.position,
            BASE_ANIMATION_TIME,
            {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
            }
        );
    }
}

export class ItemPositionAnimation extends TimelineMax {
    constructor(
        item,
        heroHeight,
        { targetPosition, initialPosition, onComplete }
    ) {
        super({
            onComplete: () => onComplete(),
        });

        const delta = {
            x: targetPosition.x - initialPosition.x,
            z: targetPosition.z - initialPosition.z,
        };

        const inAirPosition = {
            x: initialPosition.x + delta.x * 0.75,
            y: targetPosition.y + heroHeight + 0.75,
            z: initialPosition.z + delta.z * 0.75,
        };

        this.to(item.position, BASE_ANIMATION_TIME, { ...inAirPosition }).to(
            item.position,
            BASE_ANIMATION_TIME,
            {
                x: targetPosition.x,
                y: targetPosition.y + heroHeight + 0.25,
                z: targetPosition.z,
            }
        );
    }
}