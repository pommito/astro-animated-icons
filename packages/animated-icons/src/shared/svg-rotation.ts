import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createSvgRotationRecipe(stiffness: number, damping: number): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      animateSvgTransform(drawing.ownerSVGElement!, returning, track, { rotate: 180 },
        { type: "spring", stiffness, damping },
      );
    },
    clear(drawing) {
      clearSvgTransform(drawing.ownerSVGElement!);
    },
  };
}
