import type { IconRecipe, IconTrack } from "../../element";
import { animateChevronSpring, clearChevronSpring } from "../../shared/chevron-spring";

export const chevronsDownUpPaths = ["m7 20 5-5 5 5", "m7 4 5 5 5-5"];

export const chevronsDownUpRecipe = {
  finish: "hold",
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronSpring(drawing, returning, track, "Y", [-2, 2]);
  },
  clear: clearChevronSpring,
} satisfies IconRecipe;
