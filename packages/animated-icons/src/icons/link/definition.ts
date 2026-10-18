import { interpolate, easeInOut } from "motion";
import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { clearPathReveal } from "../../shared/path-reveal";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const linkRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    drawing.querySelectorAll("path").forEach((path) => {
      const length = path.getTotalLength();
      // Native CSS easing spans the timeline; upstream SVG path values ease each segment.
      const times = [0, 200, 400, 600, 1000];
      const stroke = interpolate(times, [1, 0.97, 1, 0.97, 1], { ease: easeInOut });
      const offset = interpolate(times, [0, 0.05, 0, 0.05, 0], { ease: easeInOut });
      const frames = Array.from({ length: 201 }, (_, index) => index * 5);
      const options = { duration: returning ? 0.3 : 1, ease: returning ? "easeOut" as const : "linear" as const };
      track((onComplete) => animate(path, {
        strokeDasharray: returning ? `${length}px ${length}px` : frames.map((time) => `${stroke(time) * length}px ${length}px`),
      }, { ...options, onComplete }));
      track((onComplete) => animate(path, {
        strokeDashoffset: returning ? "0px" : frames.map((time) => `${-offset(time) * length}px`),
      }, { ...options, onComplete }));
      animateSvgTransform(path, returning, track, { rotate: [0, -5, 0] },
        { duration: returning ? 0.3 : 0.5, ease: "easeOut" },
      );
    });
  },
  clear(drawing) {
    drawing.querySelectorAll("path").forEach((path) => {
      clearPathReveal(path);
      clearSvgTransform(path);
    });
  },
} satisfies IconRecipe;
