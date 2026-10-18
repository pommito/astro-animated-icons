import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { clearPathReveal } from "../../shared/path-reveal";

export const fingerprintRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    for (const path of drawing.querySelectorAll<SVGPathElement>("path:nth-child(even)")) {
      const length = path.getTotalLength();
      const style = getComputedStyle(path);
      const current = parseFloat(style.strokeDasharray) / length;
      const replaying = Number.isFinite(current) && current < 1;
      const full = `${length}px ${length}px`;
      track((onComplete) => animate(path, {
        opacity: returning ? 1 : [replaying ? Number(style.opacity) : 0, 0, 1, 1, 1],
      }, {
        duration: returning ? 0.3 : 0.5,
        ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut",
        onComplete,
      }));
      track((onComplete) => animate(path, {
        strokeDasharray: returning ? full : [replaying ? current : 0.1, 0.3, 0.5, 0.7, 0.9, 1].map((progress) => `${length * progress}px ${length}px`),
      }, {
        duration: returning ? 0.3 : 2,
        ease: returning ? [0.25, 0.1, 0.35, 1] : Array<"easeOut">(5).fill("easeOut"),
        onComplete,
      }));
    }
  },
  clear(drawing) {
    drawing.querySelectorAll<SVGPathElement>("path:nth-child(even)").forEach(clearPathReveal);
  },
} satisfies IconRecipe;
