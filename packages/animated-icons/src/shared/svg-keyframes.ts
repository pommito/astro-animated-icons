import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

type Targets = Parameters<typeof animateSvgTransform>[3];
type Transition = Parameters<typeof animateSvgTransform>[4];

export function createSvgKeyframesRecipe(
  targets: Targets,
  transition: Transition,
  origin = "50% 50%",
  returnTransition = transition,
  returnPropertyOptions: Parameters<typeof animateSvgTransform>[5] = {},
): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      const svg = drawing.ownerSVGElement!;
      const replaying = !!svg.style.transform;
      svg.style.transformOrigin = origin;
      const keyframes = Object.fromEntries(Object.entries(targets).map(([property, values]) => [
        property, replaying && Array.isArray(values) ? [null, ...values.slice(1)] : values,
      ]));
      animateSvgTransform(svg, returning, track, keyframes, returning ? returnTransition : transition, returning ? returnPropertyOptions : {});
    },
    clear(drawing) {
      clearSvgTransform(drawing.ownerSVGElement!);
      drawing.ownerSVGElement!.style.removeProperty("transform-origin");
    },
  };
}
