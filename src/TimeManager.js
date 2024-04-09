import { TweenMax } from 'gsap';

export class TimeManager {
    constructor({light}) {
        this.light = light;
        this.currentTime = 1;
        this.isStopTimeOnGameOver = false;
        // Only activate time system after player starts the game
        const keyPressHandler = (event) => {
            if (event.key === " " || event.key === "ArrowUp") {
                this.intervalId = setInterval(() => {
                    this.currentTime += 1;
                }, 1000);

                // Remove the event listener once started
                document.removeEventListener("keydown", keyPressHandler);

                this.activateTimeSystemActions();

            }
        };

        document.addEventListener("keydown", keyPressHandler);


        this.changeLightColorWithTransition = () => {
            if (this.isStopTimeOnGameOver) {
                return; // If stop time on game over is true, do not proceed with the transition
            }
        
            const colors = [0xdfebff, 0xedb20e, 0xb52828, 0x050505];  // Colors representing day, noon, afternoon, and night
            const nextIndex = (Math.floor(this.currentTime / 8) + 1) % colors.length ; // Get the index of the next color in the colors array
            const nextColor = colors[nextIndex]; // Get the next color
        
            // Animate light color change over 8 seconds using TweenMax
            TweenMax.to(light.color, 8, {
                r: (nextColor >> 16 & 255) / 255,
                g: (nextColor >> 8 & 255) / 255,
                b: (nextColor & 255) / 255,
                onComplete: () => {
                    if (!this.isStopTimeOnGameOver) {
                        this.changeLightColorWithTransition(); // Call the function again after 8 seconds (transition duration is 8 seconds)
                        if (nextIndex == colors.length - 1) {
                            this.changeLightShadowWithTransition();
                        } 
                    }
                }   
            });
        };

        this.changeLightShadowWithTransition = () => {
            if (this.isStopTimeOnGameOver) {
                return; // If stop time on game over is true, do not proceed with the transition
            }
            // light.castShadow = true;
            light.position.set(20,50,0.05);
            TweenMax.to(light.position, 24, {
                x: -20,
                y: 20,
                z: 0.05,
                onComplete: () => {

                }   
            });
        }

        this.activateTimeSystemActions = () => {
            this.changeLightShadowWithTransition();
            this.changeLightColorWithTransition();
        }

        this.stopTimeOnGameOver = () => {
            this.isStopTimeOnGameOver = true;
            clearInterval(this.intervalId);
        }
    }

    
    

}