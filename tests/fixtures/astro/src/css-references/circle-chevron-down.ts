import type { IconRecipe, IconTrack } from "../../../../../packages/animated-icons/src/element";
import { animateChevronCycle, clearChevron } from "../../../../../packages/animated-icons/src/shared/chevron";
import { circleChevronDownCycle } from "../../../../../packages/animated-icons/src/icons/circle-chevron-down/cycle";

export const circleChevronDownRecipe = {
  finish: circleChevronDownCycle.finish,
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { ...circleChevronDownCycle, axis: "Y" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
