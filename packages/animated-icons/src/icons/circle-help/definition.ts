import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const circleHelpRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector("g")!, returning, track, { rotate: [null, -10, 10, -10, 0] }, { duration: 0.5, ease: "easeInOut" });
  },
  clear(drawing) { clearSvgTransform(drawing.querySelector("g")!); },
} satisfies IconRecipe;
