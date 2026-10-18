import type { IconRecipe } from "../element";
import { animatePathReveal, clearPathReveal } from "./path-reveal";

export const calendarCheckRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const check = drawing.querySelector<SVGPathElement>("path:last-child")!;
    animatePathReveal(check, returning, track, {
      duration: returning ? 0.3 : 0.4,
      opacityDuration: returning ? 0.3 : 0.4,
      ease: returning ? [0.25, 0.1, 0.35, 1] : "easeInOut",
      preservePose: true,
    });
  },
  clear(drawing) {
    clearPathReveal(drawing.querySelector<SVGPathElement>("path:last-child")!);
  },
} satisfies IconRecipe;
