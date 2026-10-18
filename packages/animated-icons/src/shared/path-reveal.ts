import { animate } from "motion/mini";
import type { IconRecipe, IconTrack } from "../element";

type RevealOptions = NonNullable<Parameters<typeof animate>[2]> & {
  opacityDuration?: number;
  opacityDelay?: number;
  opacityEase?: NonNullable<Parameters<typeof animate>[2]>["ease"];
  reverseOffset?: boolean;
  pathOffset?: 1 | -1;
};

export function animatePathReveal(path: SVGGeometryElement, returning: boolean, track: IconTrack, options: RevealOptions) {
  const length = path.getTotalLength();
  const fullPath = `${length}px ${length}px`;
  const { opacityDuration, opacityDelay = options.delay, opacityEase = options.ease, reverseOffset, pathOffset = reverseOffset ? 1 : undefined, ...transition } = options;

  if (opacityDuration !== undefined) track((onComplete) => animate(path, { opacity: returning ? 1 : [0, 1] }, { ...transition, duration: opacityDuration, delay: opacityDelay, ease: opacityEase, onComplete }));
  track((onComplete) => animate(path, { strokeDasharray: returning ? fullPath : [`0px ${length}px`, fullPath] }, { ...transition, onComplete }));
  if (pathOffset) {
    track((onComplete) => animate(path, { strokeDashoffset: returning ? "0px" : [`${-pathOffset * length}px`, "0px"] }, { ...transition, onComplete }));
  }
}

export function clearPathReveal(path: SVGGeometryElement) {
  path.style.removeProperty("opacity");
  path.style.removeProperty("stroke-dasharray");
  path.style.removeProperty("stroke-dashoffset");
}

export function createPathRevealRecipe(strokes: RevealOptions[]): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      strokes.forEach((options, index) => animatePathReveal(drawing.children[index] as SVGGeometryElement, returning, track, options));
    },
    clear(drawing) {
      strokes.forEach((_, index) => clearPathReveal(drawing.children[index] as SVGGeometryElement));
    },
  };
}
