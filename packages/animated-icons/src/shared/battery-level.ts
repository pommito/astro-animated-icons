import { animate } from "motion/mini";
import type { IconRecipe } from "../element";

export const batteryLevelRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    drawing.querySelectorAll("[data-bar]").forEach((bar, index) => {
      const duration = 1 + index * 0.4;
      track((onComplete) => animate(bar, { opacity: returning ? 1 : [null, 0, 0, 1] }, {
        duration: returning ? 0.3 : duration,
        times: returning ? undefined : [0, 0.4 / duration, (0.4 + index * 0.4) / duration, 1],
        ease: returning ? [0.25, 0.1, 0.35, 1] : ["easeInOut", "linear", "easeInOut"],
        onComplete,
      }));
    });
  },
  clear(drawing) {
    drawing.querySelectorAll<SVGElement>("[data-bar]").forEach((bar) => bar.style.removeProperty("opacity"));
  },
} satisfies IconRecipe;
