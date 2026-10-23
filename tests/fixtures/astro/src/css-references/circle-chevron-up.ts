import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { circleChevronUpCycle } from "../../../../../packages/animated-icons/src/icons/circle-chevron-up/cycle";

export const circleChevronUpRecipe = {
  finish: circleChevronUpCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...circleChevronUpCycle, axis: "Y" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
