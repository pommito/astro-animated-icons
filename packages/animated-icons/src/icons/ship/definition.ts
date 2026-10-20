import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const shipRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animatePathReveal(drawing.children[0] as SVGPathElement, returning, track, {
      duration: 0.3, delay: returning ? 0 : 0.15, ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut",
      opacityDuration: 0.3, opacityDelay: returning ? 0 : 0.1, opacityEase: [0.25, 0.1, 0.35, 1], preservePose: true,
    });
    animateSvgTransform(drawing.querySelector<SVGElement>("[data-rock]")!, returning, track, { rotate: [-3, 3, -3] }, returning
      ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
      : { duration: 1.2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" });
  },
  clear(drawing) {
    clearPathReveal(drawing.children[0] as SVGPathElement);
    clearSvgTransform(drawing.querySelector<SVGElement>("[data-rock]")!);
  },
};
