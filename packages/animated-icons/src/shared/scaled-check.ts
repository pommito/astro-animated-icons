import type { IconRecipe, IconTrack } from "../element";
import { animate } from "motion/mini";

function animateCheck(path: SVGPathElement, returning: boolean, track: IconTrack, ease: "easeInOut" | "easeOut") {
  const length = path.getTotalLength();
  const fullPath = `${length}px ${length}px`;
  const replaying = !!path.style.transform && (new DOMMatrix(getComputedStyle(path).transform).a !== 1 || Number(getComputedStyle(path).opacity) !== 1);
  const options = {
    duration: returning ? 0.3 : 0.4,
    ease,
  };

  track((onComplete) => animate(path, { opacity: returning ? 1 : [replaying ? Number(getComputedStyle(path).opacity) : 0, 1] }, { ...options, duration: 0.1, onComplete }));
  track((onComplete) => animate(path, { strokeDasharray: returning ? fullPath : [replaying ? getComputedStyle(path).strokeDasharray : `0px ${length}px`, fullPath] }, { ...options, onComplete }));
  track((onComplete) => animate(path, { transform: returning ? "scale(1)" : [replaying ? getComputedStyle(path).transform : "scale(0.5)", "scale(1)"] }, { ...options, onComplete }));
}

function clearCheck(path: SVGPathElement) {
  for (const property of ["opacity", "stroke-dasharray", "transform"]) {
    path.style.removeProperty(property);
  }
}

export function createScaledCheckRecipe(child: number, ease: "easeInOut" | "easeOut" = "easeInOut"): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      animateCheck(drawing.querySelectorAll("path")[child], returning, track, ease);
    },
    clear(drawing) {
      clearCheck(drawing.querySelectorAll("path")[child]);
    },
  };
}
