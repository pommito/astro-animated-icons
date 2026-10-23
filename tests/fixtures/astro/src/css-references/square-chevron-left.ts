import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { squareChevronLeftCycle } from "../../../../../packages/animated-icons/src/icons/square-chevron-left/cycle";

export const squareChevronLeftRecipe = {
  finish: squareChevronLeftCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...squareChevronLeftCycle, axis: "X" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
