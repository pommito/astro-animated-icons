import type { IconRecipe, IconTrack } from "../../element";
import { animateArrow, clearArrow } from "../../shared/arrow";

export const arrowLeftPaths = ["m12 19-7-7 7-7", "M19 12H5"];

export function animateArrowLeft(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  return animateArrow(drawing, returning, track, { axis: "X" });
}

export const arrowLeftRecipe = {
  finish: "restore",
  animate: animateArrowLeft,
  clear: clearArrow,
} satisfies IconRecipe;
