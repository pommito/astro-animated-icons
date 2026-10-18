import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const externalLinkRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector<SVGGElement>("[data-arrow]")!, returning, track,
      { x: [0, 2, 0], y: [0, -2, 0], scale: [1, 0.92, 1] },
      returning
        ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
        : { duration: 0.5, ease: "easeInOut" },
      returning ? { scale: { stiffness: 550, damping: 30 } } : undefined,
    );
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGGElement>("[data-arrow]")!);
  },
} satisfies IconRecipe;
