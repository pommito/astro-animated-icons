import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";

export const castRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    [...drawing.children].slice(1).forEach((shape, index) => track(onComplete => animate(shape,
      { opacity: returning ? 1 : [0, 1] }, { duration: returning ? 0.3 : 0.5, delay: returning ? 0 : (2 - index) * 0.1, ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut", onComplete })));
  },
  clear(drawing) { [...drawing.children].slice(1).forEach(shape => (shape as SVGElement).style.removeProperty("opacity")); },
} satisfies IconRecipe;
