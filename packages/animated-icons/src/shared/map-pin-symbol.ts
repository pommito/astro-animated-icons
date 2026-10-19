import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { animatePathReveal, clearPathReveal } from "./path-reveal";
import { createSvgKeyframesRecipe } from "./svg-keyframes";

const lift = createSvgKeyframesRecipe(
  { y: [0, -5, -3] },
  { duration: 0.5, times: [0, 0.6, 1], ease: "easeOut" },
  "50% 50%",
  { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
);

interface SymbolStroke {
  child: number;
  delay: number;
  duration: number;
}

export function createMapPinSymbolRecipe(strokes: SymbolStroke[]): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      lift.animate(drawing, returning, track);
      for (const { child, delay, duration } of strokes) {
        const path = drawing.children[child] as SVGGeometryElement;
        if (returning) {
          track((onComplete) => animate(path, { opacity: 1 }, {
            duration: 0.3, ease: [0.25, 0.1, 0.35, 1], onComplete,
          }));
        } else {
          animatePathReveal(path, false, track, {
            delay, duration, ease: "easeOut", opacityDuration: 0.1,
          });
        }
      }
    },
    clear(drawing) {
      lift.clear(drawing);
      for (const { child } of strokes) clearPathReveal(drawing.children[child] as SVGGeometryElement);
    },
  };
}
