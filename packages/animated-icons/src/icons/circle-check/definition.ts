import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const circleCheckRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animatePathReveal(drawing.querySelector("path")!, returning, track,
      { duration: returning ? 0.3 : 0.4, opacityDuration: 0.1, opacityDelay: 0, ease: "easeOut", preservePose: true });
  },
  clear(drawing) { clearPathReveal(drawing.querySelector("path")!); },
} satisfies IconRecipe;
