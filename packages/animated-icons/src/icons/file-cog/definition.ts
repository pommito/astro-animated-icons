import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const fileCogRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector<SVGGElement>("g")!, returning, track,
      { rotate: 180 }, { type: "spring", stiffness: 50, damping: 10 },
    );
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGGElement>("g")!);
  },
} satisfies IconRecipe;
