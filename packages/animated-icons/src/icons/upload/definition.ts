import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const uploadRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector<SVGGElement>("g")!, returning, track, { y: -2 },
      returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { type: "spring", stiffness: 200, damping: 10 },
    );
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGGElement>("g")!);
  },
} satisfies IconRecipe;
