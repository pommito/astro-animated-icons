import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

type Targets = Parameters<typeof animateSvgTransform>[3];
type Transition = Parameters<typeof animateSvgTransform>[4];
interface ShapeMotion {
  child: number;
  targets: Targets;
  transition: Transition;
  returning?: Transition;
}

export function createShapeTransformRecipe(shapes: ShapeMotion[]): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      for (const shape of shapes) {
        animateSvgTransform(drawing.children[shape.child] as SVGElement, returning, track,
          shape.targets, returning ? (shape.returning ?? shape.transition) : shape.transition);
      }
    },
    clear(drawing) {
      for (const shape of shapes) clearSvgTransform(drawing.children[shape.child] as SVGElement);
    },
  };
}
