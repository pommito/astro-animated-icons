import type { IconRecipe } from "../../../../../packages/animated-icons/src/element";
import { animateSvgTransform, clearSvgTransform } from "../../../../../packages/animated-icons/src/shared/svg-transform";
import { circleHelpCycle as cycle } from "../../../../../packages/animated-icons/src/icons/circle-help/cycle";
const target = (drawing: SVGGElement) => drawing.querySelector<SVGElement>(cycle.target)!;
export const circleHelpRecipe: IconRecipe = {
  finish: cycle.finish,
  animate(drawing, returning, track) {
    const values: (number | null)[] = [...cycle.values];
    values[0] = null;
    animateSvgTransform(target(drawing), returning, track, { rotate: values }, { duration: cycle.duration, times: cycle.times, ease: cycle.ease });
  },
  clear(drawing) { clearSvgTransform(target(drawing)); },
};
