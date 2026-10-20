import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const phoneOffRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animatePathReveal(drawing.children[1] as SVGGeometryElement, returning, track, {
      duration: returning ? 0.3 : 0.4,
      ease: returning ? [0.25, 0.1, 0.35, 1] : "linear",
    });
  },
  clear(drawing) {
    clearPathReveal(drawing.children[1] as SVGGeometryElement);
  },
};
