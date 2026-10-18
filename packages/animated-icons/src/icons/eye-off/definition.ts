import { animate } from "motion/mini";
import type { IconRecipe } from "../../element";
import { clearPathReveal } from "../../shared/path-reveal";

export const eyeOffRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const path = drawing.querySelectorAll("path")[3];
    const length = path.getTotalLength();
    const options = { duration: returning ? 0.3 : 0.6, ease: returning ? [0.25, 0.1, 0.35, 1] as const : "easeOut" as const };
    track((onComplete) => animate(path, { opacity: returning ? 1 : [0, 1] }, { ...options, onComplete }));
    track((onComplete) => animate(path, { strokeDasharray: returning ? `${length}px ${length}px` : [`0px ${length}px`, `${2 * length}px ${length}px`] }, { ...options, onComplete }));
    track((onComplete) => animate(path, { strokeDashoffset: returning ? "0px" : ["0px", `${-2 * length}px`] }, { ...options, onComplete }));
  },
  clear(drawing) {
    clearPathReveal(drawing.querySelectorAll("path")[3]);
  },
} satisfies IconRecipe;
