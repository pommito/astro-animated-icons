import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";

export const terminalRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    track(onComplete => animate(drawing.querySelector("line")!, { opacity: returning ? 1 : [1, 0, 1] }, returning
      ? { duration: 0.3, ease: [0.25, 0.1, 0.35, 1], onComplete }
      : { duration: 0.8, ease: "linear", repeat: Infinity, onComplete }));
  },
  clear(drawing) { drawing.querySelector("line")!.style.removeProperty("opacity"); },
} satisfies IconRecipe;
