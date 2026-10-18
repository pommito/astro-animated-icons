import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export const messageBubbleRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing, returning, track, { scale: 1.05 },
      returning
        ? { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 }
        : { type: "spring", stiffness: 400, damping: 10 },
    );
    animateSvgTransform(drawing.querySelector<SVGGElement>("[data-rotation]")!, returning, track,
      { rotate: [0, -7, 7, 0] },
      returning
        ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
        : { duration: 0.5, ease: "easeInOut" },
    );
  },
  clear(drawing) {
    clearSvgTransform(drawing);
    clearSvgTransform(drawing.querySelector<SVGGElement>("[data-rotation]")!);
  },
} satisfies IconRecipe;
