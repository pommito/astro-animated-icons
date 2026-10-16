import type { IconRecipe, IconTrack } from "../../element";
import { animateChevronSpring, clearChevronSpring } from "../../shared/chevron-spring";

export const chevronsUpDownPaths = ["m7 15 5 5 5-5", "m7 9 5-5 5 5"];

export const chevronsUpDownRecipe = {
  finish: "hold",
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronSpring(drawing, returning, track, "Y", [2, -2]);
  },
  clear: clearChevronSpring,
} satisfies IconRecipe;
