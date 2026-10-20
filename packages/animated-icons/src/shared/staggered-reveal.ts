import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { animatePathReveal, clearPathReveal } from "./path-reveal";

interface RevealStep {
  child: number;
  preservePose?: boolean;
  delay: number;
  opacityDelay?: number;
  duration?: number;
  defaultEase?: boolean;
  reverseOffset?: boolean;
  opacityOnly?: boolean;
  opacityEase?: NonNullable<Parameters<typeof animate>[2]>["ease"];
  returnDelay?: number;
}

const defaultEase = [0.25, 0.1, 0.35, 1] as const;

export function createStaggeredRevealRecipe(steps: RevealStep[]): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      for (const step of steps) {
        const shape = drawing.children[step.child - 1] as SVGGeometryElement;
        const delay = returning ? step.returnDelay ?? 0 : step.delay;
        const opacityDelay = returning ? delay : step.opacityDelay ?? delay;
        if (step.opacityOnly) {
          track((onComplete) => animate(shape, { opacity: returning ? 1 : [0, 1] }, {
            duration: 0.3, delay: opacityDelay, ease: returning ? defaultEase : step.opacityEase ?? defaultEase, onComplete,
          }));
        } else {
          animatePathReveal(shape, returning, track, {
            duration: returning ? 0.3 : step.duration ?? 0.3,
            delay,
            ease: returning || step.defaultEase ? defaultEase : "easeOut",
            opacityDuration: 0.3,
            opacityDelay,
            opacityEase: defaultEase,
            reverseOffset: step.reverseOffset,
            preservePose: step.preservePose,
          });
        }
      }
    },
    clear(drawing) {
      for (const step of steps) clearPathReveal(drawing.children[step.child - 1] as SVGGeometryElement);
    },
  };
}
