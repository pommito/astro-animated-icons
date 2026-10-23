import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { chevronUpCycle } from "../../../../../packages/animated-icons/src/icons/chevron-up/cycle";

export const chevronUpRecipe = {
  finish: chevronUpCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...chevronUpCycle, axis: "Y" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
