import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";

export const githubRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const [body, tail] = [...drawing.querySelectorAll("path")];
    const duration = returning ? 0.3 : 0.4;
    animatePathReveal(body, returning, track, { duration, opacityDuration: duration, ease: "easeOut" });
    track((onComplete) => animate(body, { transform: returning ? "scale(1)" : ["scale(0.9)", "scale(1)"] }, { duration, ease: "easeOut", onComplete }));
    const length = tail.getTotalLength();
    const fullPath = `${length}px ${length}px`;
    track((onComplete) => animate(tail, { strokeDasharray: returning ? fullPath : [`0px ${length}px`, fullPath] }, {
      duration: returning ? 0.3 : 0.5, ease: "easeOut", onComplete,
    }));
    if (returning) {
      track((onComplete) => animate(tail, { transform: "rotate(0deg)" }, { duration: 0.3, ease: "easeOut", onComplete }));
      return;
    }
    track((onComplete) => {
      let active = true;
      let control = animate(tail, { transform: "rotate(0deg)" }, {
        duration: 0.5,
        ease: "easeOut",
        onComplete: () => {
          if (!active) { onComplete(); return; }
          control = animate(tail, { transform: [0, -15, 15, -10, 10, -5, 5].map((angle) => `rotate(${angle}deg)`) }, {
            duration: 2.5, ease: Array<"easeInOut">(6).fill("easeInOut"), repeat: Infinity,
          });
        },
      });
      return {
        stop() { active = false; control.stop(); },
        cancel() { active = false; control.cancel(); },
      };
    });
  },
  clear(drawing) {
    for (const path of drawing.querySelectorAll("path")) {
      clearPathReveal(path);
      path.style.removeProperty("transform");
    }
  },
} satisfies IconRecipe;
