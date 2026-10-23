import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { chevronDownCycle } from "../../../../../packages/animated-icons/src/icons/chevron-down/cycle";

export const chevronDownRecipe = {
  finish: chevronDownCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...chevronDownCycle, axis: "Y" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
