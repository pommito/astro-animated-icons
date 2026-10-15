import { animateArrow } from "../arrow";

export const arrowLeftPaths = ["m12 19-7-7 7-7", "M19 12H5"];

export function animateArrowLeft(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  return animateArrow(drawing, returning, onComplete, { axis: "X" });
}
