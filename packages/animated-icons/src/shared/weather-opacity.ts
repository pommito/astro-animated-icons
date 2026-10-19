import { animate } from "motion/mini";
import type { IconRecipe } from "../element";

export function createWeatherOpacityRecipe(minimum: number, duration: number, stagger = 0): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      drawing.querySelectorAll<SVGElement>("[data-weather]").forEach((stroke, index) => {
        track((onComplete) => animate(stroke, { opacity: returning ? 1 : [1, minimum, 1] }, {
          duration: returning ? 0.3 : duration,
          delay: returning ? 0 : index * stagger,
          ease: returning ? [0.25, 0.1, 0.35, 1] : "easeInOut",
          repeat: returning ? 0 : Infinity,
          onComplete,
        }));
      });
    },
    clear(drawing) {
      drawing.querySelectorAll<SVGElement>("[data-weather]").forEach((stroke) => stroke.style.removeProperty("opacity"));
    },
  };
}
