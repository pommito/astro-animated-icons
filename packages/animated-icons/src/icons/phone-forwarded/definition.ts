import type { IconRecipe } from "../../element";
import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

const pulse = createSvgKeyframesRecipe(
  { scale: [1, 1.1, 1] }, { duration: 0.9, ease: "easeInOut" }, "50% 50%",
  { type: "spring", stiffness: 550, damping: 30 },
);

export const phoneForwardedRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    pulse.animate(drawing, returning, track);
    for (const [index, shape] of [...drawing.children].slice(0, 2).entries()) {
      const element = shape as SVGElement;
      const start = element.style.transform ? null : 0;
      animateSvgTransform(element, returning, track, {
        translateX: [start, 3, 0],
        ...(index === 0 ? { scale: [element.style.transform ? null : 1, 0.85, 1] } : {}),
      }, returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { duration: 0.5, ease: "easeInOut" },
      returning ? { scale: { type: "spring", stiffness: 550, damping: 30 } } : {});
    }
  },
  clear(drawing) {
    pulse.clear(drawing);
    [...drawing.children].slice(0, 2).forEach(shape => clearSvgTransform(shape as SVGElement));
  },
};
