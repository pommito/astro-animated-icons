import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const searchRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.ownerSVGElement!, returning, track,
      { x: [0, 0, -3, 0], y: [0, -4, 0, 0] },
      { duration: 1, ease: "easeOut" },
    );
  },
  clear(drawing) {
    clearSvgTransform(drawing.ownerSVGElement!);
  },
} satisfies IconRecipe;
