import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { squareChevronRightCycle } from "../../../../../packages/animated-icons/src/icons/square-chevron-right/cycle";

export const squareChevronRightRecipe = {
  finish: squareChevronRightCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...squareChevronRightCycle, axis: "X" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
