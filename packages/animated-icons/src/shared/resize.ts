import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createResizeRecipe(offsets: readonly (readonly [number, number])[]): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      drawing.querySelectorAll<SVGPathElement>("[data-corner]").forEach((path, index) => {
        const [x, y] = offsets[index];
        animateSvgTransform(path, returning, track, { x, y }, { type: "spring", stiffness: 250, damping: 25 });
      });
    },
    clear(drawing) {
      drawing.querySelectorAll<SVGPathElement>("[data-corner]").forEach(clearSvgTransform);
    },
  };
}
