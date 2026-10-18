import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const userRoundPlusRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    for (const [index, shape] of [...drawing.children].slice(2).entries()) {
      const path = shape as SVGGeometryElement;
      if (returning) {
        track((onComplete) => animate(path, { opacity: 1 }, { duration: 0.3, ease: [0.25, 0.1, 0.35, 1], onComplete }));
      } else {
        animatePathReveal(path, false, track, {
          duration: 0.2, delay: (index + 1) * 0.3, ease: "easeOut",
          opacityDuration: 0.1,
        });
      }
    }
  },
  clear(drawing) {
    for (const shape of [...drawing.children].slice(2)) clearPathReveal(shape as SVGGeometryElement);
  },
} satisfies IconRecipe;
