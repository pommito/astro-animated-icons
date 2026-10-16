import type { IconRecipe, IconTrack } from "../../element";
import { animateChevronSpring, clearChevronSpring } from "../../shared/chevron-spring";

export const chevronsRightLeftPaths = ["m20 17-5-5 5-5", "m4 17 5-5-5-5"];

export const chevronsRightLeftRecipe = {
  finish: "hold",
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronSpring(drawing, returning, track, "X", [-2, 2]);
  },
  clear: clearChevronSpring,
} satisfies IconRecipe;
