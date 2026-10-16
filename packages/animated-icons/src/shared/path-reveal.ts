import { animate } from "motion/mini";
import type { IconTrack } from "../element";

type RevealOptions = NonNullable<Parameters<typeof animate>[2]> & { opacityDuration: number };

export function animatePathReveal(path: SVGPathElement, returning: boolean, track: IconTrack, options: RevealOptions) {
  const length = path.getTotalLength();
  const fullPath = `${length}px ${length}px`;
  const { opacityDuration, ...transition } = options;

  track((onComplete) => animate(path, { opacity: returning ? 1 : [0, 1] }, { ...transition, duration: opacityDuration, onComplete }));
  track((onComplete) => animate(path, { strokeDasharray: returning ? fullPath : [`0px ${length}px`, fullPath] }, { ...transition, onComplete }));
}

export function clearPathReveal(path: SVGPathElement) {
  path.style.removeProperty("opacity");
  path.style.removeProperty("stroke-dasharray");
}
