import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { squareChevronDownCycle } from "../../../../../packages/animated-icons/src/icons/square-chevron-down/cycle";

export const squareChevronDownRecipe = {
  finish: squareChevronDownCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...squareChevronDownCycle, axis: "Y" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
