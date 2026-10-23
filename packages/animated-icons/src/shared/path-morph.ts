import { animate, svgEffect, type ValueAnimationTransition } from "motion";
import type { IconTrack } from "../element";

export function animatePathMorph(path: SVGPathElement, values: string | string[], track: IconTrack, options: ValueAnimationTransition) {
  track(onComplete => {
    const animation = animate(path, { attrD: values }, { ...options, onComplete });
    // Stopping detaches attribute updates without rewinding the current morph.
    return { stop: () => animation.stop(), cancel: () => animation.stop() };
  });
}

export function clearPathMorph(path: SVGPathElement, idle: string) {
  svgEffect.state(path)?.release();
  path.setAttribute("d", idle);
}
