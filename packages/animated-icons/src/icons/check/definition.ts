import type { IconRecipe, IconTrack } from "../../element";
import { animate } from "motion/mini";

export const checkPath = "M4 12 9 17L20 6";

export function animateCheck(drawing: SVGGElement, returning: boolean, track: IconTrack) {
  const path = drawing.querySelector("path")!;
  const length = path.getTotalLength();
  const fullPath = `${length}px ${length}px`;
  const options = {
    duration: returning ? 0.3 : 0.4,
    ease: "easeInOut" as const,
  };

  track((onComplete) => animate(path, { opacity: returning ? 1 : [0, 1] }, { ...options, duration: 0.1, onComplete }));
  track((onComplete) => animate(path, { strokeDasharray: returning ? fullPath : [`0px ${length}px`, fullPath] }, { ...options, onComplete }));
  track((onComplete) => animate(path, { transform: returning ? "scale(1)" : ["scale(0.5)", "scale(1)"] }, { ...options, onComplete }));
}

export function clearCheck(drawing: SVGGElement) {
  const path = drawing.querySelector("path")!;
  for (const property of ["opacity", "stroke-dasharray", "transform"]) {
    path.style.removeProperty(property);
  }
}

export const checkRecipe = {
  finish: "hold",
  animate: animateCheck,
  clear: clearCheck,
} satisfies IconRecipe;
