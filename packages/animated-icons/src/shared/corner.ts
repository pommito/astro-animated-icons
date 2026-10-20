import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createCornerRecipe(axis: "X" | "Y", displacement: number): IconRecipe {
  const scale = axis === "X" ? "scaleX" : "scaleY";
  const translation = axis === "X" ? "x" : "y";
  return {
    finish: "restore",
    animate(drawing, returning, track) {
      const svg = drawing.ownerSVGElement!;
      svg.style.transformOrigin = "50% 50%";
      animateSvgTransform(svg, returning, track, {
        [scale]: [svg.style.transform ? null : 1, 1.15, 1],
        [translation]: [svg.style.transform ? null : 0, displacement, 0],
      }, returning
        ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
        : { duration: 0.45, ease: "easeInOut" },
      returning ? { [scale]: { stiffness: 550, damping: 30 } } : {});
    },
    clear(drawing) {
      clearSvgTransform(drawing.ownerSVGElement!);
      drawing.ownerSVGElement!.style.removeProperty("transform-origin");
    },
  };
}
