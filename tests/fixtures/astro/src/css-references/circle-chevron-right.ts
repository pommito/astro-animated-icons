import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { circleChevronRightCycle } from "../../../../../packages/animated-icons/src/icons/circle-chevron-right/cycle";

export const circleChevronRightRecipe = {
  finish: circleChevronRightCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...circleChevronRightCycle, axis: "X" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
