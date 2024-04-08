import { TweenMax } from 'gsap';

export class TimeManager {
    constructor({light}) {
        this.light = light;
        this.currentTime = 1;
        
        // Only activate time system after player starts the game
        const keyPressHandler = (event) => {
            if (event.key === " " || event.key === "ArrowUp") {
                this.intervalId = setInterval(() => {
                    this.currentTime += 1;
                }, 1000);

                // Remove the event listener once started
                document.removeEventListener("keydown", keyPressHandler);
            }
        };

        document.addEventListener("keydown", keyPressHandler);


        this.changeLightColorWithTransition = () => {
            const colors = [0xdfebff, 0xedb20e, 0xb52828, 0x050505];  // Colors representing day, noon, afternoon, and night
            const nextIndex = Math.floor(this.currentTime / 8 ) % colors.length; // Get the index of the next color in the colors array
            const nextColor = colors[nextIndex]; // Get the next color

            // Animate light color change over 1 second using TweenMax
            TweenMax.to(light.color, 8, {
                r: (nextColor >> 16 & 255) / 255,
                g: (nextColor >> 8 & 255) / 255,
                b: (nextColor & 255) / 255,
                onComplete: () => {
                    this.changeLightColorWithTransition(); // Call the function again after 7 seconds (transition duration is 1 second)
                }   
            });
        }
    }

    
    

}