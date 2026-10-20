import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";

export const boldRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    track(onComplete => animate(drawing.querySelector("path")!, { strokeWidth: returning ? 2 : 3.5 }, {
      duration: 0.6, ease: "easeOut", onComplete,
    }));
  },
  clear(drawing) {
    drawing.querySelector("path")!.style.removeProperty("stroke-width");
  },
} satisfies IconRecipe;
