import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

export function createHardDriveArrowRecipe(normal: number, target: number): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      const arrow = drawing.querySelector<SVGGElement>("[data-arrow]")!;
      animateSvgTransform(arrow, returning, track, { y: target }, returning
        ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
        : { type: "spring", stiffness: 200, damping: 10, mass: 1 }, {}, { y: normal });
    },
    clear(drawing) {
      const arrow = drawing.querySelector<SVGGElement>("[data-arrow]")!;
      clearSvgTransform(arrow);
      if (normal) arrow.style.transform = `translateY(${normal}px)`;
    },
  };
}
