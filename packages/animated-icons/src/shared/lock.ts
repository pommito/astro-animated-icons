import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { clearPathReveal } from "./path-reveal";
import { createSvgKeyframesRecipe } from "./svg-keyframes";

const ease = [0.4, 0, 0.2, 1] as [number, number, number, number];

export function createLockRecipe(open: boolean): IconRecipe {
  const motion = createSvgKeyframesRecipe({
    rotate: open ? [2, 4, -2, 0] : [-3, 1, -2, 0],
    scale: open ? [1.05, 0.95, 1.02, 1] : [0.95, 1.05, 0.98, 1],
  }, { duration: 1, ease });
  const normal = open ? 0.8 : 1;
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      motion.animate(drawing, returning, track);
      const path = drawing.querySelector("path")!;
      track((onComplete) => animate(path, {
        strokeDasharray: returning ? `${normal}px 1px` : [path.style.strokeDasharray || `${normal}px 1px`, `${open ? 1 : 0.7}px 1px`],
      }, { duration: 0.3, ease, onComplete }));
    },
    clear(drawing) {
      motion.clear(drawing);
      clearPathReveal(drawing.querySelector("path")!);
    },
  };
}
