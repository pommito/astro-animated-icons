import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const banRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    [...drawing.children].forEach((shape, index) => animatePathReveal(shape as SVGGeometryElement, returning, track,
      { duration: returning || index ? 0.3 : 0.4, delay: returning ? 0 : index * 0.5, opacityDuration: !returning && index ? 0.3 : 0.1, opacityDelay: returning ? 0 : index * 0.5, ease: !returning && index ? [0.25, 0.1, 0.35, 1] : "easeOut", preservePose: true }));
  },
  clear(drawing) { [...drawing.children].forEach(shape => clearPathReveal(shape as SVGGeometryElement)); },
} satisfies IconRecipe;
