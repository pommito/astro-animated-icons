import type { IconRecipe } from "../element";
import { animatePathReveal, clearPathReveal } from "./path-reveal";

export function createWindRecipe(delays: number[]): IconRecipe {
  return {
    finish: "restore",
    animate(drawing, returning, track) {
      delays.forEach((delay, index) => animatePathReveal(drawing.children[index] as SVGPathElement, returning, track, {
        duration: returning ? 0.3 : 0.5,
        delay,
        ease: "easeInOut",
        opacityDuration: returning ? 0.3 : 0.5,
        pathOffset: 1,
        preservePose: "until-clear",
      }));
    },
    clear(drawing) {
      delays.forEach((_, index) => clearPathReveal(drawing.children[index] as SVGPathElement));
    },
  };
}
