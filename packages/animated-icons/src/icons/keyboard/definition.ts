import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export function createKeyboardRecipe(random: () => number = Math.random): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      drawing.querySelectorAll<SVGElement>("[data-key]").forEach((key, index) => {
        if (returning) { clearSvgTransform(key); return; }
        animateSvgTransform(key, false, track, { opacity: [1, 0.2, 1] }, {
          duration: 1.5, times: [0, 0.5, 1], delay: index * 0.2 * random(), repeat: 1, repeatType: "reverse",
        });
      });
    },
    clear(drawing) {
      drawing.querySelectorAll<SVGElement>("[data-key]").forEach(clearSvgTransform);
    },
  };
}

export const keyboardRecipe = createKeyboardRecipe();
