import { TweenMax } from 'gsap';
import { realTimeToGameTimeRatio } from './GameSettings';

export class TimeManager {
    constructor({light}) {
        this.light = light;
        this.isStopTimeOnGameOver = false;

        // Activate time system on key press
        const keyPressHandler = (event) => {
            if (event.key === " " || event.key === "ArrowUp") {
                this.updateGameTimeBasedOnRealTime();
                this.intervalId = setInterval(() => {
                    this.updateGameTimeBasedOnRealTime();
                }, 1000); // Update game time every second

                // Remove the event listener once started
                document.removeEventListener("keydown", keyPressHandler);
            }
        };

        document.addEventListener("keydown", keyPressHandler);
    }

    // Function to update game time based on real time
    updateGameTimeBasedOnRealTime() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Convert current time to seconds
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        // Map real time to game time
        this.currentTime = totalSeconds * realTimeToGameTimeRatio;

        // Update light color based on current time
        this.updateLightColorBasedOnTime(totalSeconds);
    }

    // Function to update light color based on time of day
    updateLightColorBasedOnTime(totalSeconds) {
        if (this.isStopTimeOnGameOver) {
            return; // If stop time on game over is true, do not proceed with the transition
        }

        const colors = [0xdfebff, 0xedb20e, 0xb52828, 0x050505]; // Colors representing day, noon, afternoon, and night
        const secondsInADay = 24 * 3600; // Total seconds in a day
        const segmentDuration = secondsInADay / colors.length; // Duration of each segment in seconds

        // Determine the current segment
        const currentSegment = Math.floor(totalSeconds / segmentDuration) % colors.length;
        const currentColor = colors[currentSegment];

        // Directly set the light color based on the current segment
        this.light.color.setRGB(
            (currentColor >> 16 & 255) / 255,
            (currentColor >> 8 & 255) / 255,
            (currentColor & 255) / 255
        );
    }

    changeLightShadowWithTransition() {
        if (this.isStopTimeOnGameOver) {
            return; // If stop time on game over is true, do not proceed with the transition
        }

        // Directly set the light position based on the time of day
        const now = new Date();
        const hours = now.getHours();
        const positionFactor = (hours / 24) * 40 - 20; // Adjust position based on the hour

        this.light.position.set(positionFactor, 50 - positionFactor, 0.05);

        // Animate the light position smoothly
        TweenMax.to(this.light.position, 24, {
            x: positionFactor,
            y: 50 - positionFactor,
            z: 0.05
        });
    }

    stopTimeOnGameOver() {
        this.isStopTimeOnGameOver = true;
        clearInterval(this.intervalId);
    }
}
