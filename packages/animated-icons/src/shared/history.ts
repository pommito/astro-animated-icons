import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { clearPathReveal } from "./path-reveal";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

const transition = { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

export function createHistoryRecipe(direction: number): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      const [arrow, arc] = drawing.querySelectorAll("path");
      animateSvgTransform(arrow, returning, track, {
        x: [null, direction * 2.1, 0], y: [null, -1.4, 0], rotate: [null, direction * 12, 0],
      }, transition);
      const length = arc.getTotalLength();
      const full = `${length}px ${length}px`;
      track((onComplete) => animate(arc, {
        strokeDasharray: returning ? full : [arc.style.strokeDasharray || full, `${length * 0.8}px ${length}px`, full],
      }, { ...transition, ease: returning ? transition.ease : [transition.ease, transition.ease], onComplete }));
      const dot = drawing.querySelector("circle");
      if (dot) animateSvgTransform(dot, returning, track, { scale: [null, 1.2, 1] }, transition);
    },
    clear(drawing) {
      drawing.querySelectorAll<SVGElement>("path, circle").forEach(clearSvgTransform);
      clearPathReveal(drawing.querySelectorAll("path")[1]);
    },
  };
}
