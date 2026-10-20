import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const playRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector("polygon")!, returning, track,
      { x: [null, -1, 2, 0], rotate: [null, -10, 0, 0] },
      returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { duration: 0.5, times: [0, 0.2, 0.5, 1], ease: "easeOut" });
  },
  clear(drawing) { clearSvgTransform(drawing.querySelector("polygon")!); },
} satisfies IconRecipe;
