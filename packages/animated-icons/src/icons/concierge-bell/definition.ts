import type { IconRecipe } from "../../element";
import { animateSequence } from "../../shared/sequence";
import { createSvgPartsRecipe } from "../../shared/svg-parts";

const parts = createSvgPartsRecipe([
  {
    selector: "[data-stem]",
    variants: {
      normal: { y: 0 },
      animate: { y: 2, transition: { duration: 0.1 } },
    },
  },
  {
    selector: "[data-bell]",
    variants: {
      normal: { rotate: 0 },
      animate: {
        rotate: [0, -2, 2, -2, 2, -1, 1, 0],
        transition: { delay: 0.1, duration: 0.28, ease: "easeInOut" },
      },
    },
  },
  {
    selector: "[data-waves]",
    variants: {
      normal: { opacity: 0, scale: 1 },
      animate: {
        opacity: [0, 1, 0], scale: [0.8, 1, 1.3],
        transition: { delay: 0.13, duration: 0.7, ease: "easeOut", times: [0, 0.2, 1] },
      },
    },
  },
]);

export const conciergeBellRecipe: IconRecipe = {
  finish: "restore",
  animate(drawing, returning, track) {
    if (returning) parts.animate(drawing, true, track);
    else animateSequence(track, [
      track => parts.animate(drawing, false, track),
      track => parts.animate(drawing, true, track),
    ]);
  },
  clear(drawing) {
    parts.clear(drawing);
    drawing.querySelector<SVGElement>("[data-waves]")!.style.opacity = "0";
  },
};
