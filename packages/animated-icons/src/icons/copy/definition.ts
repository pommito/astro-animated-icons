import type { IconRecipe, IconTrack } from "../../element";
import { spring } from "motion";
import { animate } from "motion/mini";

export const copyPath = "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2";

export function animateCopy(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  const options = {
    type: spring,
    stiffness: 160,
    damping: 17,
    mass: 1,
  };
  track((onComplete) => animate(drawing.querySelector("rect")!, { transform: returning ? "translate(0px, 0px)" : "translate(-3px, -3px)" }, { ...options, onComplete }));
  track((onComplete) => animate(drawing.querySelector("path")!, { transform: returning ? "translate(0px, 0px)" : "translate(3px, 3px)" }, { ...options, onComplete }));
}

export function clearCopy(drawing: SVGGElement) {
  drawing.querySelectorAll("rect, path").forEach((part) => {
    (part as SVGElement).style.removeProperty("transform");
  });
}

export const copyRecipe = {
  finish: "hold",
  animate: animateCopy,
  clear: clearCopy,
} satisfies IconRecipe;
