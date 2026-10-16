import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";

export const moonRecipe = {
  finish: "restore",
  animate(drawing, returning, track) {
    track((onComplete) => animate(drawing, {
      transform: returning ? "rotate(0deg)" : [0, -10, 10, -5, 5, 0].map((angle) => `rotate(${angle}deg)`),
    }, { duration: 1.2, ease: returning ? "easeInOut" : Array<"easeInOut">(5).fill("easeInOut"), onComplete }));
  },
  clear(drawing) {
    drawing.style.removeProperty("transform");
  },
} satisfies IconRecipe;
