import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const fileChartLineRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animatePathReveal(drawing.querySelector<SVGPathElement>("[data-motion]")!, returning, track, {
      duration: 0.3, delay: returning ? 0 : 0.15, ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut",
      opacityEase: [0.25, 0.1, 0.35, 1], opacityDuration: 0.3, opacityDelay: returning ? 0 : 0.1,
    });
  },
  clear(drawing) {
    clearPathReveal(drawing.querySelector<SVGPathElement>("[data-motion]")!);
  },
} satisfies IconRecipe;
