import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { chevronFirstCycle } from "../../../../../packages/animated-icons/src/icons/chevron-first/cycle";

export const chevronFirstRecipe = {
  finish: chevronFirstCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...chevronFirstCycle, axis: "X" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
