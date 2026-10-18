import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { clearPathReveal } from "./path-reveal";

interface CycleStep {
  child: number;
  hideDelay: number;
  revealDelay: number;
  opacityOnly?: boolean;
}

export function createStaggeredCycleRecipe(steps: CycleStep[], hideDuration = 0.3): IconRecipe {
  const revealStart = Math.max(...steps.map(step => step.hideDelay)) + hideDuration;
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      for (const step of steps) {
        const shape = drawing.children[step.child - 1] as SVGGeometryElement;
        const length = shape.getTotalLength();
        const fullPath = `${length}px ${length}px`;
        const delay = returning ? 0 : step.hideDelay;
        const duration = returning ? 0.3 : revealStart + step.revealDelay + 0.3 - delay;
        const transition: NonNullable<Parameters<typeof animate>[2]> = {
          delay, duration,
          times: returning ? undefined : [0, hideDuration / duration, (revealStart + step.revealDelay - delay) / duration, 1],
          ease: returning ? [0.25, 0.1, 0.35, 1] : ["easeOut", "linear", "easeOut"],
        };
        track(onComplete => animate(shape, {
          opacity: returning ? 1 : [null, 0, 0, 1],
        }, { ...transition, onComplete }));
        if (!step.opacityOnly) {
          if (getComputedStyle(shape).strokeDasharray === "none") shape.style.strokeDasharray = fullPath;
          track(onComplete => animate(shape, {
            strokeDasharray: returning ? fullPath : [null, `0px ${length}px`, `0px ${length}px`, fullPath],
          }, { ...transition, onComplete }));
        }
      }
    },
    clear(drawing) {
      for (const step of steps) clearPathReveal(drawing.children[step.child - 1] as SVGGeometryElement);
    },
  };
}
