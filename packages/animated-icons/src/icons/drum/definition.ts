import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const drumRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    [...drawing.querySelectorAll("path")].slice(0, 2).forEach((path, index) => animateSvgTransform(path, returning, track,
      { rotate: index === 0 ? [-10, 10, 0] : [10, -10, 0] },
      returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { duration: 0.5, delay: (index + 1) * 0.1, ease: "easeOut", repeat: Infinity, repeatType: "reverse" }));
  },
  clear(drawing) { [...drawing.querySelectorAll("path")].slice(0, 2).forEach(clearSvgTransform); },
} satisfies IconRecipe;
