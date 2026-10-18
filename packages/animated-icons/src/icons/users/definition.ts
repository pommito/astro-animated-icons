import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const usersRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    for (const shape of [...drawing.children].slice(2)) {
      animateSvgTransform(shape as SVGElement, returning, track,
        { x: [-6, 0] },
        { type: "spring", stiffness: 200, damping: 13, delay: returning ? 0 : 0.1 },
      );
    }
  },
  clear(drawing) {
    for (const shape of [...drawing.children].slice(2)) clearSvgTransform(shape as SVGElement);
  },
} satisfies IconRecipe;
