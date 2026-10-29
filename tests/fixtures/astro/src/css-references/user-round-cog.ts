import type { IconRecipe } from "../../../../../packages/animated-icons/src/element";
import { animateSvgTransform, clearSvgTransform } from "../../../../../packages/animated-icons/src/shared/svg-transform";
import { userRoundCogCycle as cycle } from "../../../../../packages/animated-icons/src/icons/user-round-cog/cycle";
const target = (drawing: SVGGElement) => drawing.querySelector<SVGElement>(cycle.target)!;
export const userRoundCogRecipe: IconRecipe = {
  finish: cycle.finish,
  animate(drawing, returning, track) {
    animateSvgTransform(target(drawing), returning, track, { rotate: cycle.values.at(-1)! }, { duration: cycle.duration, ease: cycle.ease });
  },
  clear(drawing) { clearSvgTransform(target(drawing)); },
};
