import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createLetterArrowRecipe(offset: number): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      drawing.querySelectorAll("path").forEach((path, index) => {
        const letter = index < 2;
        animateSvgTransform(path, returning, track, letter
          ? { scale: [0.8, 1] }
          : { y: [offset, 0] }, returning
          ? { type: "spring", stiffness: letter ? 550 : 500, damping: letter ? 30 : 25, restSpeed: 10 }
          : { duration: 0.3, delay: letter ? 0 : 0.2, ease: "easeOut" });
        track(onComplete => animate(path, { opacity: returning ? 1 : [0, 1] }, {
          duration: 0.3, delay: returning || letter ? 0 : 0.2,
          ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut", onComplete,
        }));
      });
    },
    clear(drawing) {
      drawing.querySelectorAll("path").forEach(clearSvgTransform);
    },
  };
}
