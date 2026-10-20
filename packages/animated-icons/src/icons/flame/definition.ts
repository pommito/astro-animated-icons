import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const flameRecipe = {
  finish: "restore",
  animate(drawing, returning, track) {
    animatePathReveal(drawing.querySelector("path")!, returning, track, {
      duration: returning ? 0.3 : 0.4,
      delay: returning ? 0 : 0.1,
      ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut",
      opacityDuration: returning ? 0.3 : 0.1,
      preservePose: "until-clear",
    });
  },
  clear(drawing) { clearPathReveal(drawing.querySelector("path")!); },
} satisfies IconRecipe;
