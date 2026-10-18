import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const bluetoothConnectedRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    track((onComplete) => animate(drawing.querySelector("path")!, { opacity: returning ? 1 : [0, 1, 0.5, 1] }, {
      duration: 0.3,
      delay: returning ? 0 : 0.2,
      ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut",
      onComplete,
    }));
    drawing.querySelectorAll("line").forEach((line, index) => {
      animatePathReveal(line, returning, track, {
        duration: returning ? 0.3 : index === 0 ? 0.4 : 0.2,
        opacityDuration: returning ? 0.3 : index === 0 ? 0.4 : 0.2,
        ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut",
        pathOffset: index === 0 ? 1 : -1,
      });
    });
  },
  clear(drawing) {
    drawing.querySelectorAll("path, line").forEach((shape) => clearPathReveal(shape as SVGGeometryElement));
  },
} satisfies IconRecipe;
