import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";
import { clearPathReveal } from "../../shared/path-reveal";

export const airplaneRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector<SVGPathElement>("[data-plane]")!, returning, track, { x: 3, y: -3, scale: 0.8 }, { duration: 0.5 });
    drawing.querySelectorAll<SVGLineElement>("[data-streak]").forEach((line, index) => {
      const duration = returning ? 0.3 : 0.15;
      const delay = returning ? 0 : (index + 1) * 0.1;
      track(onComplete => animate(line, {
        opacity: returning ? 0 : 1,
        transform: returning ? "translate(-3px, 3px)" : ["translate(0px, 0px)", "translate(0px, 0px)"],
        strokeDashoffset: returning ? "-1px" : ["-1px", "-2px"],
      }, { duration, delay, ease: "easeOut", onComplete }));
    });
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGPathElement>("[data-plane]")!);
    drawing.querySelectorAll<SVGLineElement>("[data-streak]").forEach(line => { clearSvgTransform(line); clearPathReveal(line); });
  },
};
