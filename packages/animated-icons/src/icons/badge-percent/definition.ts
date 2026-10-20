import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const badgePercentRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector("path")!, returning, track, { rotate: 180 },
      returning ? { type: "spring", stiffness: 60, damping: 10, duration: 0.5 } : { type: "spring", stiffness: 80, damping: 13, delay: 0.1 });
  },
  clear(drawing) { clearSvgTransform(drawing.querySelector("path")!); },
} satisfies IconRecipe;
