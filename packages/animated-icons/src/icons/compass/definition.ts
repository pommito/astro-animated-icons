import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const compassRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector("polygon")!, returning, track, { rotate: 360 },
      { type: "spring", stiffness: 120, damping: 15 });
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector("polygon")!);
  },
} satisfies IconRecipe;
