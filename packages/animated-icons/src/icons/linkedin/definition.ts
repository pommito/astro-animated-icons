import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const linkedinRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    for (const shape of drawing.querySelectorAll<SVGGeometryElement>("path, rect, circle")) {
      animatePathReveal(shape, returning, track, {
        duration: returning ? 0.4 : 0.6,
        ease: returning ? [0.25, 0.1, 0.35, 1] : "linear",
        opacityDuration: 0.1,
        opacityEase: [0.25, 0.1, 0.35, 1],
        reverseOffset: true,
      });
    }
  },
  clear(drawing) {
    for (const shape of drawing.querySelectorAll<SVGGeometryElement>("path, rect, circle")) clearPathReveal(shape);
  },
} satisfies IconRecipe;
