import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const chartPieRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.children[0] as SVGElement, returning, track,
      { translateX: 1.1, y: -1.1 }, { type: "spring", stiffness: 250, damping: 15 });
  },
  clear(drawing) {
    clearSvgTransform(drawing.children[0] as SVGElement);
  },
} satisfies IconRecipe;
