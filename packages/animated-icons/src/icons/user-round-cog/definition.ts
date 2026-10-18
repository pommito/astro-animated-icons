import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const userRoundCogRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector<SVGGElement>("[data-cog]")!, returning, track,
      { rotate: 180 },
      { duration: 0.3, ease: "easeOut" },
    );
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGGElement>("[data-cog]")!);
  },
} satisfies IconRecipe;
