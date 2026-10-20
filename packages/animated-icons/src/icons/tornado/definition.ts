import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const tornadoRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    [...drawing.children].forEach((shape, index) => {
      const custom = index + 1;
      animateSvgTransform(shape as SVGPathElement, returning, track, { x: [null, custom, 0] }, returning
        ? { duration: 0.3, ease: "easeInOut" }
        : { duration: 0.6, repeat: 1, delay: custom * 0.1, ease: "easeInOut" });
    });
  },
  clear(drawing) {
    for (const path of drawing.children) clearSvgTransform(path as SVGPathElement);
  },
} satisfies IconRecipe;
