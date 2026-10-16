import type { IconRecipe, IconTrack } from "../../element";
import { animateChevronCycle, clearChevron } from "../../shared/chevron";

export const chevronFirstPaths = ["m17 18-6-6 6-6", "M7 6v12"];

export const chevronFirstRecipe = {
  finish: "restore",
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { axis: "X", values: [-2, 1, -1, 0], duration: 0.6, times: [0, 0.3, 0.7, 1], ease: "easeInOut", returnDuration: 0.3 });
  },
  clear: clearChevron,
} satisfies IconRecipe;
