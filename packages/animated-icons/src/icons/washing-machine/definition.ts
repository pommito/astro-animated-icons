import type { IconRecipe } from "../../element";
import { createSvgPartsRecipe } from "../../shared/svg-parts";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

const body = createSvgPartsRecipe([{
  selector: "[data-body]",
  variants: {
    normal: { x: 0 },
    animate: {
      x: [0, 0.5, -0.5, 0.3, -0.3, 0],
      transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
    },
  },
}]);

export const washingMachineRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    body.animate(drawing, returning, track);
    const drum = drawing.querySelector<SVGElement>("[data-drum]")!;
    const spin = drawing.querySelector<SVGElement>("[data-spin]")!;
    animateSvgTransform(drum, returning, track, { y: [0, -0.3, 0, 0.3, 0] }, returning
      ? { duration: 0.5, ease: "linear" }
      : { duration: 0.3, repeat: Infinity, ease: "easeInOut", preservePose: true });
    animateSvgTransform(spin, returning, track, { rotate: 360 }, returning
      ? { duration: 0.5, ease: "linear" }
      : { duration: 1, repeat: Infinity, ease: "linear", preservePose: true });
  },
  clear(drawing) {
    body.clear(drawing);
    clearSvgTransform(drawing.querySelector<SVGElement>("[data-drum]")!);
    clearSvgTransform(drawing.querySelector<SVGElement>("[data-spin]")!);
  },
};
