import { animateDiagonalArrow } from "../diagonal-arrow";

export const arrowUpRightPaths = ["M7 7H17", "M17 7V17", "M7 17L17 7"];
export const arrowUpRightOrigin = "transform-box: view-box; transform-origin: 17px 7px";

export function animateArrowUpRight(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  return animateDiagonalArrow(drawing, returning, onComplete, -1);
}
