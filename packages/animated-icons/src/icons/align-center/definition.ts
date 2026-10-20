import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const alignCenterRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const path = drawing.querySelector("path")!;
    animateSvgTransform(path, returning, track, { translateX: [path.style.transform ? null : 0, 3, -3, 2, -2, 0] }, returning
      ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
      : { duration: 1, ease: "easeOut" });
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector("path")!);
  },
} satisfies IconRecipe;
