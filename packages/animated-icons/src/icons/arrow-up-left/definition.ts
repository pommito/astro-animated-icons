import { animateDiagonalArrow } from "../diagonal-arrow";

export const arrowUpLeftPaths = ["M7 7H17", "M7 7V17", "M17 17L7 7"];
export const arrowUpLeftOrigin = "transform-box: view-box; transform-origin: 7px 7px";

export function animateArrowUpLeft(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  return animateDiagonalArrow(drawing, returning, onComplete, 1);
}
