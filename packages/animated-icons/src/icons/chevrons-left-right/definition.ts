import type { IconRecipe, IconTrack } from "../../element";
import { animateChevronSpring, clearChevronSpring } from "../../shared/chevron-spring";

export const chevronsLeftRightPaths = ["m9 7-5 5 5 5", "m15 7 5 5-5 5"];

export const chevronsLeftRightRecipe = {
  finish: "hold",
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronSpring(drawing, returning, track, "X", [-2, 2]);
  },
  clear: clearChevronSpring,
} satisfies IconRecipe;
