import type { IconRecipe } from "../element";
import { animatePathReveal, clearPathReveal } from "./path-reveal";

export function createSymbolRevealRecipe(firstChild: number, strokes = 1): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      for (let index = 0; index < strokes; index++) {
        animatePathReveal(drawing.children[firstChild + index] as SVGGeometryElement, returning, track, {
          duration: returning ? 0.3 : 0.4,
          delay: returning ? 0 : index * 0.2,
          ease: returning ? [0.25, 0.1, 0.35, 1] : "easeInOut",
          opacityDuration: returning ? 0.3 : 0.4,
        });
      }
    },
    clear(drawing) {
      for (let index = 0; index < strokes; index++) {
        clearPathReveal(drawing.children[firstChild + index] as SVGGeometryElement);
      }
    },
  };
}
