import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createPlaneFlightRecipe(targets: { x: number[]; y: number[]; scale: number[]; rotate: number[] }, times?: number[]): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      const plane = drawing.querySelector<SVGPathElement>("[data-plane]")!;
      animateSvgTransform(plane, returning, track, targets, returning
        ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
        : { duration: 1.1, ease: [0.25, 1, 0.5, 1], times },
        returning ? { scale: { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 } } : {});
      track(onComplete => animate(plane, { opacity: returning ? 1 : times ? [0, 1, 1] : [0, 1] }, returning
        ? { duration: 0.3, ease: [0.25, 0.1, 0.35, 1], onComplete }
        : { duration: 1.1, ease: [0.25, 1, 0.5, 1], times, onComplete }));
    },
    clear(drawing) { clearSvgTransform(drawing.querySelector<SVGPathElement>("[data-plane]")!); },
  };
}
