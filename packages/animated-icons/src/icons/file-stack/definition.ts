import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const fileStackRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    drawing.querySelectorAll<SVGElement>("[data-motion]").forEach((path, index) => {
      animateSvgTransform(path, returning, track,
        index < 2 ? { x: -4, y: 4 } : { x: 4, y: -4 },
        { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
      );
    });
  },
  clear(drawing) {
    drawing.querySelectorAll<SVGElement>("[data-motion]").forEach(clearSvgTransform);
  },
} satisfies IconRecipe;
