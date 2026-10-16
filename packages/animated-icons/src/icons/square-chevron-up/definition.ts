import type { IconRecipe, IconTrack } from "../../element";
import { animateChevronCycle, clearChevron } from "../../shared/chevron";

export const squareChevronUpPaths = ["m8 14 4-4 4 4"];

export const squareChevronUpRecipe = {
  finish: "restore",
  animate(drawing: SVGGElement, returning: boolean, track: IconTrack) {
    animateChevronCycle(drawing, returning, track, { axis: "Y", values: [0, -2, 0], duration: 0.5, times: [0, 0.4, 1], ease: "easeOut" });
  },
  clear: clearChevron,
} satisfies IconRecipe;
