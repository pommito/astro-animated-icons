import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";

export const batteryRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const fill = drawing.querySelector<SVGRectElement>("[data-fill]")!;
    for (const [property, target] of [["width", returning ? "0px" : "12px"], ["opacity", returning ? 0 : 1]] as const) {
      track((onComplete) => animate(fill, { [property]: target }, {
        duration: returning ? 0.3 : 0.4,
        ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut",
        onComplete,
      }));
    }
  },
  clear(drawing) {
    const fill = drawing.querySelector<SVGRectElement>("[data-fill]")!;
    fill.style.removeProperty("width");
    fill.style.removeProperty("opacity");
  },
} satisfies IconRecipe;
