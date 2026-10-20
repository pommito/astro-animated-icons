import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const routeRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    [...drawing.children].forEach((shape, index) => {
      animatePathReveal(shape as SVGGeometryElement, returning, track, {
        duration: index === 1 ? 0.7 : 0.3, delay: index === 1 ? 0.5 : 0.1,
        ease: "easeOut", opacityDuration: 0.3, opacityDelay: index === 1 ? 0.5 : 0.15,
        opacityEase: [0.25, 0.1, 0.35, 1], reverseOffset: index === 1, preservePose: true,
      });
    });
  },
  clear(drawing) { [...drawing.children].forEach(shape => clearPathReveal(shape as SVGGeometryElement)); },
};
