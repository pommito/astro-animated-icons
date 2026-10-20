import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const pauseRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    drawing.querySelectorAll("rect").forEach((rect, index) => animateSvgTransform(rect, returning, track,
      { y: index === 0 ? [null, 2, 0, 0] : [null, 0, 2, 0] },
      returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { duration: 0.5, times: [0, 0.2, 0.5, 1], ease: "easeOut" }));
  },
  clear(drawing) { drawing.querySelectorAll("rect").forEach(clearSvgTransform); },
} satisfies IconRecipe;
