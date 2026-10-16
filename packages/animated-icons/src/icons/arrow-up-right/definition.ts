import type { IconRecipe, IconTrack } from "../../element";
import { animateDiagonalArrow, clearDiagonalArrow } from "../../shared/diagonal-arrow";

export const arrowUpRightPaths = ["M7 7H17", "M17 7V17", "M7 17L17 7"];
export const arrowUpRightOrigin = "transform-box: view-box; transform-origin: 17px 7px";

export function animateArrowUpRight(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  return animateDiagonalArrow(drawing, returning, track, -1);
}

export const arrowUpRightRecipe = {
  finish: "restore",
  animate: animateArrowUpRight,
  clear: clearDiagonalArrow,
} satisfies IconRecipe;
