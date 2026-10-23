import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { chevronRightCycle } from "../../../../../packages/animated-icons/src/icons/chevron-right/cycle";

export const chevronRightRecipe = {
  finish: chevronRightCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...chevronRightCycle, axis: "X" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
