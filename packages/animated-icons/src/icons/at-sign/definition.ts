import type { IconRecipe, IconTrack } from "../../element";
import { animate } from "motion/mini";

export const atSignPath = "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8";

export function animateAtSign(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  const circle = drawing.querySelector("circle")!;
  const path = drawing.querySelector("path")!;
  const circleLength = circle.getTotalLength();
  const pathLength = path.getTotalLength();
  const options = {
    duration: returning ? 0.4 : 0.3,
    ease: "easeInOut" as const,
  };
  const outer = { ...options, delay: 0.3, duration: 0.3 };

  track((onComplete) => animate(circle, { opacity: returning ? 1 : [0, 1] }, { ...options, duration: 0.1, onComplete }));
  track((onComplete) => animate(circle, { strokeDasharray: returning ? `${circleLength}px ${circleLength}px` : [`0px ${circleLength}px`, `${circleLength}px ${circleLength}px`] }, { ...options, onComplete }));
  track((onComplete) => animate(circle, { strokeDashoffset: returning ? "0px" : [`${-circleLength}px`, "0px"] }, { ...options, onComplete }));
  track((onComplete) => animate(path, { opacity: returning ? 1 : [0, 1] }, { ...outer, duration: 0.1, onComplete }));
  track((onComplete) => animate(path, { strokeDasharray: returning ? `${pathLength}px ${pathLength}px` : [`0px ${pathLength}px`, `${pathLength}px ${pathLength}px`] }, { ...outer, onComplete }));
}

export function clearAtSign(drawing: SVGGElement) {
  for (const shape of drawing.querySelectorAll<SVGElement>("circle, path")) {
    for (const property of ["opacity", "stroke-dasharray", "stroke-dashoffset"]) {
      shape.style.removeProperty(property);
    }
  }
}

export const atSignRecipe = {
  finish: "hold",
  animate: animateAtSign,
  clear: clearAtSign,
} satisfies IconRecipe;
