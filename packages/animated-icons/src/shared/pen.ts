import type { IconTrack } from "../element";
import { animateSvgTransform } from "./svg-transform";

export function animatePen(pen: SVGElement, returning: boolean, track: IconTrack) {
  animateSvgTransform(pen, returning, track,
    { rotate: [-0.3, 0.2, -0.4], x: [0, -0.5, 1, 0], y: [0, 1, -0.5, 0] },
    returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
      : { duration: 0.5, repeat: 1, ease: "easeInOut" });
}
