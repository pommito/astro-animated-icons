import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { chevronLeftCycle } from "../../../../../packages/animated-icons/src/icons/chevron-left/cycle";

export const chevronLeftRecipe = {
  finish: chevronLeftCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...chevronLeftCycle, axis: "X" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
