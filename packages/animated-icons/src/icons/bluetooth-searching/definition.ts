import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const bluetoothSearchingRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    track(onComplete => animate(drawing.children[0], { opacity: returning ? 1 : [1, 0.8, 1] }, {
      duration: returning ? 0.3 : 0.8,
      repeat: returning ? 0 : Infinity,
      ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut", onComplete,
    }));
    [1, 2].forEach(index => animateSvgTransform(drawing.children[index] as SVGElement, returning, track,
      { scale: [0, 1, 0.8] },
      { duration: 0.6, delay: index === 1 ? 0.2 : 0, ease: "easeOut", repeat: returning ? 0 : Infinity }));
  },
  clear(drawing) {
    [...drawing.children].forEach(shape => clearSvgTransform(shape as SVGElement));
  },
} satisfies IconRecipe;
