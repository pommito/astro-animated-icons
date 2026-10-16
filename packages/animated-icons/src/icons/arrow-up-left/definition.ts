import type { IconRecipe, IconTrack } from "../../element";
import { animateDiagonalArrow, clearDiagonalArrow } from "../../shared/diagonal-arrow";

export const arrowUpLeftPaths = ["M7 7H17", "M7 7V17", "M17 17L7 7"];
export const arrowUpLeftOrigin = "transform-box: view-box; transform-origin: 7px 7px";

export function animateArrowUpLeft(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  return animateDiagonalArrow(drawing, returning, track, 1);
}

export const arrowUpLeftRecipe = {
  finish: "restore",
  animate: animateArrowUpLeft,
  clear: clearDiagonalArrow,
} satisfies IconRecipe;
