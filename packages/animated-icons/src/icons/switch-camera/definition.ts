import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const switchCameraRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    drawing.querySelectorAll("path").forEach(path => animatePathReveal(path, returning, track,
      returning ? { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] } : { duration: 0.4, ease: "linear", preservePose: true }));
  },
  clear(drawing) { drawing.querySelectorAll("path").forEach(clearPathReveal); },
} satisfies IconRecipe;
