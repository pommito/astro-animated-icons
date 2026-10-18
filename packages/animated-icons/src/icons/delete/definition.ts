import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const deleteRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    for (const [index, y] of [-1.1, 1, 0.5, 0.5].entries()) {
      animateSvgTransform(drawing.querySelector<SVGElement>(`[data-motion="${index}"]`)!, returning, track,
        { y }, { type: "spring", stiffness: 500, damping: 30 },
      );
    }
  },
  clear(drawing) {
    drawing.querySelectorAll<SVGElement>("[data-motion]").forEach(clearSvgTransform);
  },
} satisfies IconRecipe;
