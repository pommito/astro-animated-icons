import { animate } from "motion/mini";
import type { IconTrack } from "../element";

export function animateBlink(element: SVGElement, returning: boolean, track: IconTrack) {
  track((onComplete) => animate(element, { opacity: returning ? 1 : [1, 0, 1] }, {
    duration: returning ? 0.3 : 0.6,
    ease: returning ? [0.25, 0.1, 0.35, 1] : "easeInOut",
    onComplete,
  }));
}

export function clearBlink(element: SVGElement) {
  element.style.removeProperty("opacity");
}
