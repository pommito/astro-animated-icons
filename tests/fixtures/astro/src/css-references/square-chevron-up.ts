import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { squareChevronUpCycle } from "../../../../../packages/animated-icons/src/icons/square-chevron-up/cycle";

export const squareChevronUpRecipe = {
  finish: squareChevronUpCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...squareChevronUpCycle, axis: "Y" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
