import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { clearPathReveal } from "../../shared/path-reveal";

export const receiptTextRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    [...drawing.querySelectorAll("path")].slice(1).forEach((path, index) => {
      const length = path.getTotalLength();
      const full = `${length}px ${length}px`;
      const empty = `0px ${length}px`;
      if (!path.style.strokeDasharray) path.style.strokeDasharray = full;
      const delay = (2 - index) * 0.06;
      const duration = 0.32 + index * 0.1 + 0.35 - delay;
      track((onComplete) => animate(path, {
        strokeDasharray: returning ? full : [null, empty, empty, full],
      }, {
        duration: returning ? 0.35 : duration,
        delay: returning ? index * 0.1 : delay,
        times: returning ? undefined : [0, 0.2 / duration, (0.32 + index * 0.1 - delay) / duration, 1],
        ease: "linear",
        onComplete,
      }));
    });
  },
  clear(drawing) {
    [...drawing.querySelectorAll("path")].slice(1).forEach(clearPathReveal);
  },
} satisfies IconRecipe;
