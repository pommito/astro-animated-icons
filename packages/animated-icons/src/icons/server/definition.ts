import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const serverRecipe = {
  finish: "restore",
  animate(drawing, returning, track) {
    drawing.querySelectorAll<SVGElement>("[data-motion]").forEach((group, index) => {
      animateSvgTransform(group, returning, track, { y: [null, index ? -12 : 12, index ? -12 : 12, 0] }, returning
        ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
        : { duration: 0.9, ease: "easeInOut", times: [0, 0.35, 0.65, 1], repeat: 1 });
    });
  },
  clear(drawing) { drawing.querySelectorAll<SVGElement>("[data-motion]").forEach(clearSvgTransform); },
} satisfies IconRecipe;
