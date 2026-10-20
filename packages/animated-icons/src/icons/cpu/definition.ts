import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const cpuRecipe = {
  finish: "restore",
  animate(drawing, returning, track) {
    drawing.querySelectorAll<SVGPathElement>("[data-motion]").forEach((pin, index) => {
      const axis = index < 2 || index > 5 ? "scaleY" : "scaleX";
      track(onComplete => animate(pin, { opacity: returning ? 1 : [1, 0.8, 1] }, { duration: 0.5, ease: "easeInOut", repeat: 1, onComplete }));
      animateSvgTransform(pin, returning, track, { [axis]: [null, 1.5, 1] }, { duration: 0.5, ease: "easeInOut", repeat: 1 });
    });
  },
  clear(drawing) { drawing.querySelectorAll<SVGElement>("[data-motion]").forEach(clearSvgTransform); },
} satisfies IconRecipe;
