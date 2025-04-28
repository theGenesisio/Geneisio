import { gsap } from "gsap";
import { useGSAP as animate } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
/**
 * Fades in elements with a slight upward movement when they enter the viewport.
 * @param {string} selector - The CSS selector for the target elements.
 * @param {object} [options] - Optional configuration for the animation.
 * @param {number} [options.duration=1] - Duration of the animation in seconds.
 * @param {number} [options.delay=0] - Delay before the animation starts.
 * @param {number} [options.y=20] - vertical dist of y.
 */
function fadeIn(selector, options = {}) {
    animate(() => {
        gsap.from(selector, {
            y: options.y || 20,
            scale: 0.975,
            opacity: 0,
            duration: options.duration || 1,
            delay: options.delay || 0,
            stagger: {
                amount: 0.25,
                ease: "power1.inOut",
                grid: [2, 1],
                axis: "y",
                from: "start",
            },
            scrollTrigger: {
                trigger: selector,
                start: "top 80%",
                toggleActions: "restart none none none"
            },
        });
    });
}
/**
 * Creates a staggered fade-in effect for multiple elements.
 * @param {string} selector - The CSS selector for the target elements.
 * @param {object} [options] - Optional configuration for the animation.
 * @param {number} [options.duration=1] - Duration of the animation in seconds.
 * @param {number} [options.delay=0] - Delay before the animation starts.
 * @param {number} [options.y=20] - vertical dist of y.
 * @param {number} [options.stagger=0.2] - Time between the start of each animation.
 */
const staggerFadeIn = (selector, options = {}) => {
    animate(() => {
        gsap.from(selector, {
            opacity: 0,
            y: options.y || 20,
            duration: options.duration || 1,
            delay: options.delay || 0,
            stagger: options.stagger || 0.2,
            scrollTrigger: {
                trigger: selector,
                start: "top 80%",
                toggleActions: "restart none none none"
            },
        })
    })
}
/**
 * Creates a staggered fade-in effect for multiple elements.
 * @param {string} selector - The CSS selector for the target elements.
 * @param {object} [options] - Optional configuration for the animation.
 * @param {number} [options.duration=1] - Duration of the animation in seconds.
 * @param {number} [options.delay=0] - Delay before the animation starts.
 * @param {number} [options.y=20] - vertical dist of y.
 * @param {number} [options.stagger=0.2] - Time between the start of each animation.
 */
const staggerFadeIn2 = (selector, options = {}) => {
    animate(() => {
        gsap.from(selector, {
            opacity: 0,
            y: options.y || 20,
            duration: options.duration || 1,
            delay: options.delay || 0,
            stagger: options.stagger || 0.2,
            scrollTrigger: {
                trigger: selector,
                start: "top 80%",
                toggleActions: "restart none none none"
            },
        })
    })
}
/**
 * Slides elements in from the left when they enter the viewport.
 * @param {string} selector - The CSS selector for the target elements.
 * @param {object} [options] - Optional configuration for the animation.
 * @param {number} [options.duration=1] - Duration of the animation in seconds.
 * @param {number} [options.delay=0] - Delay before the animation starts.
 */
const slideIn = (selector, options = {}) => {
    animate(() => {
        gsap.from(selector, {
            x: options.x || -100, // Defaults to left
            opacity: 0,
            duration: options.duration || 1,
            delay: options.delay || 0,
            scrollTrigger: {
                trigger: selector,
                start: "top 80%",
                toggleActions: "restart none none none"
            },
        });
    })
};

/**
 * Scales elements up when they enter the viewport.
 * @param {string} selector - The CSS selector for the target elements.
 * @param {object} [options] - Optional configuration for the animation.
 * @param {number} [options.duration=1] - Duration of the animation in seconds.
 * @param {number} [options.delay=0] - Delay before the animation starts.
 */
const scaleUp = (selector, options = {}) => {
    animate(() => {
        gsap.from(selector, {
            scale: 0.8,
            opacity: 0,
            duration: options.duration || 1,
            delay: options.delay || 0,
            scrollTrigger: {
                trigger: selector,
                start: "top 80%",
                toggleActions: "restart none none none"
            },
        });
    })
};
export { fadeIn, staggerFadeIn, staggerFadeIn2, scaleUp, slideIn }