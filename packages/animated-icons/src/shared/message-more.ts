import { animate } from "motion/mini";
import type { IconRecipe } from "../element";

export const messageMoreRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    [...drawing.querySelectorAll("path")].slice(1).forEach((dot, index) => {
      track((onComplete) => animate(dot, { opacity: returning ? 1 : [1, 0, 0, 1, 1, 0, 0, 1] }, {
        duration: returning ? 0.3 : 1.5,
        ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut",
        times: returning ? undefined : [0, 0.1, 0.1 + index * 0.1, 0.2 + index * 0.1, 0.5, 0.6, 0.6 + index * 0.1, 0.7 + index * 0.1],
        onComplete,
      }));
    });
  },
  clear(drawing) {
    drawing.querySelectorAll("path").forEach((dot) => dot.style.removeProperty("opacity"));
  },
} satisfies IconRecipe;
