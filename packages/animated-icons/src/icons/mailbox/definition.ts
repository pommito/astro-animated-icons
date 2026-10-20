import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const mailboxRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.children[1] as SVGElement, returning, track, { rotate: -90 }, {
      type: "spring", stiffness: returning ? 300 : 280, damping: returning ? 18 : 12,
    });
  },
  clear(drawing) {
    clearSvgTransform(drawing.children[1] as SVGElement);
  },
};
