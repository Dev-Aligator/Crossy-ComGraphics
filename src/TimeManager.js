import { TweenMax } from 'gsap';

export class TimeManager {
    constructor({light}) {
        this.light = light;
        this.currentTime = 1;
        
        setInterval(() => {
            this.currentTime = this.currentTime + 1;  // Assume 1 second = 1 hour in game
        }, 1000);


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