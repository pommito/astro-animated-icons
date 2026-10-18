import type { IconRecipe } from "../element";
import { animatePathReveal, clearPathReveal } from "./path-reveal";

export const userCheckRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animatePathReveal(drawing.children[2] as SVGGeometryElement, returning, track, {
      duration: returning ? 0.3 : 0.4,
      ease: returning ? [0.25, 0.1, 0.35, 1] : "easeInOut",
      opacityDuration: returning ? 0.3 : 0.4,
    });
  },
  clear(drawing) {
    clearPathReveal(drawing.children[2] as SVGGeometryElement);
  },
} satisfies IconRecipe;
