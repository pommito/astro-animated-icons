import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createLoginRecipe(offset: number): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      drawing.querySelectorAll<SVGElement>("polyline, line").forEach((arrow) => {
        animateSvgTransform(arrow, returning, track,
          { x: offset, translateX: [null, -1.5 * offset, 0] }, { duration: 0.4, ease: "easeOut" });
      });
    },
    clear(drawing) {
      drawing.querySelectorAll<SVGElement>("polyline, line").forEach(clearSvgTransform);
    },
  };
}
