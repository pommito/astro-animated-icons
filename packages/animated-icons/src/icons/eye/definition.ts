import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const eyeRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    drawing.querySelectorAll("path, circle").forEach((shape) => {
      track((onComplete) => animate(shape, { opacity: returning ? 1 : [1, 0.3, 1] }, { duration: 0.4, ease: "easeInOut", onComplete }));
    });
    const options = { duration: 0.4, ease: "easeInOut" as const };
    animateSvgTransform(drawing.querySelector("path")!, returning, track,
      { scaleY: [1, 0.1, 1] }, options,
    );
    animateSvgTransform(drawing.querySelector("circle")!, returning, track,
      { scale: [1, 0.3, 1] }, options,
    );
  },
  clear(drawing) {
    drawing.querySelectorAll<SVGElement>("path, circle").forEach(clearSvgTransform);
  },
} satisfies IconRecipe;
