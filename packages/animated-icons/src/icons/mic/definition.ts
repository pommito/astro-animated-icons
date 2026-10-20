import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const micRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector("rect")!, returning, track, { y: [null, -3, 0, -2, 0] },
      returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { duration: 0.6, ease: "easeInOut" });
  },
  clear(drawing) { clearSvgTransform(drawing.querySelector("rect")!); },
} satisfies IconRecipe;
