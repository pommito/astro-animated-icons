import type { IconRecipe } from "../../../../../packages/animated-icons/src/element";
import { animateSvgTransform, clearSvgTransform } from "../../../../../packages/animated-icons/src/shared/svg-transform";
import { folderUpCycle as cycle } from "../../../../../packages/animated-icons/src/icons/folder-up/cycle";
const target = (drawing: SVGGElement) => drawing.querySelector<SVGElement>(cycle.target)!;
export const folderUpRecipe: IconRecipe = {
  finish: cycle.finish,
  animate(drawing, returning, track) {
    const values = [...cycle.values];
    animateSvgTransform(target(drawing), returning, track, { y: values }, { duration: cycle.duration, times: cycle.times, ease: cycle.ease });
  },
  clear(drawing) { clearSvgTransform(target(drawing)); },
};
