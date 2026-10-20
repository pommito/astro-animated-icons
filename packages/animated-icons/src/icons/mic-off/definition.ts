import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const micOffRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animatePathReveal(drawing.querySelector<SVGPathElement>("path:last-child")!, returning, track,
      { duration: returning ? 0.3 : 0.4, delay: returning ? 0 : 0.15, opacityDuration: 0.1, opacityDelay: 0, ease: "easeOut", preservePose: true });
  },
  clear(drawing) { clearPathReveal(drawing.querySelector<SVGPathElement>("path:last-child")!); },
} satisfies IconRecipe;
