import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createRotationRecipe(angle: number): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      animateSvgTransform(drawing, returning, track, { rotate: angle },
        { type: "spring", stiffness: 250, damping: 25 });
    },
    clear: clearSvgTransform,
  };
}
