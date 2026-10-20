import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

type Targets = Parameters<typeof animateSvgTransform>[3];

export function createAlignmentRecipe(poses: Targets[]): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      poses.forEach((pose, index) => animateSvgTransform(drawing.children[index] as SVGElement, returning, track, pose, {
        type: "spring", stiffness: 160, damping: 17, mass: 1,
      }));
    },
    clear(drawing) {
      [...drawing.children].forEach(shape => clearSvgTransform(shape as SVGElement));
    },
  };
}
