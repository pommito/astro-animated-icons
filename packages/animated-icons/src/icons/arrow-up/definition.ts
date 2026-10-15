import { spring } from "motion";
import { animateArrow } from "../arrow";

export const arrowUpPaths = ["m5 12 7-7 7 7", "M12 19V5"];

export function animateArrowUp(drawing: SVGGElement, returning: boolean, onComplete: (restoreDrawing: boolean) => void) {
  return animateArrow(drawing, returning, onComplete, {
    axis: "Y",
    playback: { ease: ["easeOut", "easeOut"] },
    headReturn: { type: spring, stiffness: 500, damping: 25, restSpeed: 10 },
    shaftReturn: { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] },
  });
}
