import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";
import { clearPathReveal } from "../../shared/path-reveal";

export const sendRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.children[0] as SVGElement, returning, track,
      { x: 3, y: -3, scale: 0.8 }, { duration: 0.5 });
    const trail = drawing.children[1] as SVGPathElement;
    track(onComplete => animate(trail, {
      opacity: returning ? 0 : 1,
      strokeDasharray: returning ? "0px 1px" : "1px 1px",
      transform: returning ? "translate(-3px, 3px)" : "translate(0px, 0px)",
    }, { duration: returning ? 0.3 : 0.55, delay: returning ? 0 : 0.1, ease: "easeOut", onComplete }));
  },
  clear(drawing) {
    clearSvgTransform(drawing.children[0] as SVGElement);
    const trail = drawing.children[1] as SVGPathElement;
    clearSvgTransform(trail);
    clearPathReveal(trail);
  },
};
