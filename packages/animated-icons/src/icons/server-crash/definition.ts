import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const serverCrashRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animatePathReveal(drawing.querySelector<SVGPathElement>("[data-motion]")!, returning, track, {
      duration: returning ? 0.3 : 0.4,
      ease: returning ? [0.25, 0.1, 0.35, 1] : "linear",
      preservePose: true,
    });
  },
  clear(drawing) { clearPathReveal(drawing.querySelector<SVGPathElement>("[data-motion]")!); },
} satisfies IconRecipe;
