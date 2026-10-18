import type { IconRecipe } from "../element";
import { animatePathReveal, clearPathReveal } from "./path-reveal";

export function createCheckRevealRecipe(duration = 0.4): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      animatePathReveal(drawing.children[2] as SVGGeometryElement, returning, track, {
        duration: returning ? 0.3 : duration,
        ease: returning ? [0.25, 0.1, 0.35, 1] : "easeInOut",
        opacityDuration: returning ? 0.3 : duration,
      });
    },
    clear(drawing) {
      clearPathReveal(drawing.children[2] as SVGGeometryElement);
    },
  };
}

export const checkRevealRecipe = createCheckRevealRecipe();
