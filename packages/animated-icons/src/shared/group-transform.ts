import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createGroupTransformRecipe(
  targets: Parameters<typeof animateSvgTransform>[3],
  transition: Parameters<typeof animateSvgTransform>[4],
): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      animateSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!, returning, track, targets, transition);
    },
    clear(drawing) {
      clearSvgTransform(drawing.querySelector<SVGElement>('[data-motion="0"]')!);
    },
  };
}
