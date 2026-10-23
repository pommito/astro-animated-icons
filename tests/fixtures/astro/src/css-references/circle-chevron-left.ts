import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { circleChevronLeftCycle } from "../../../../../packages/animated-icons/src/icons/circle-chevron-left/cycle";

export const circleChevronLeftRecipe = {
  finish: circleChevronLeftCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...circleChevronLeftCycle, axis: "X" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
