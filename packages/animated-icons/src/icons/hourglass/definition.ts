import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const hourglassRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing, returning, track, { rotate: 180 },
      { type: "spring", stiffness: 100, damping: 15 });
  },
  clear: clearSvgTransform,
} satisfies IconRecipe;
