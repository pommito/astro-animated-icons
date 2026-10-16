import type { IconRecipe, IconTrack } from "../../element";
import { spring } from "motion";
import { animateArrow, clearArrow } from "../../shared/arrow";

export const arrowUpPaths = ["m5 12 7-7 7 7", "M12 19V5"];

export function animateArrowUp(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  return animateArrow(drawing, returning, track, {
    axis: "Y",
    playback: { ease: ["easeOut", "easeOut"] },
    headReturn: { type: spring, stiffness: 500, damping: 25, restSpeed: 10 },
    shaftReturn: { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] },
  });
}

export const arrowUpRecipe = {
  finish: "restore",
  animate: animateArrowUp,
  clear: clearArrow,
} satisfies IconRecipe;
