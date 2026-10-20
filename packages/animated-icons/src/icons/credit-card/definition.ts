import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const creditCardRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing, returning, track,
      { x: [null, -4, 1.5, 0] },
      returning ? { type: "spring", stiffness: 280, damping: 18, restSpeed: 10 } : { duration: 0.7, times: [0, 0.4, 0.75, 1], ease: "easeInOut" });
  },
  clear: clearSvgTransform,
} satisfies IconRecipe;
