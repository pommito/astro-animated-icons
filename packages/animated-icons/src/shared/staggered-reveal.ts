import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { animatePathReveal, clearPathReveal } from "./path-reveal";

interface RevealStep {
  child: number;
  preservePose?: boolean | "until-clear";
  delay: number;
  opacityDelay?: number;
  duration?: number;
  defaultEase?: boolean;
  reverseOffset?: boolean;
  opacityOnly?: boolean;
  opacityEase?: NonNullable<Parameters<typeof animate>[2]>["ease"];
  returnDelay?: number;
}

const opacityPlaybacks = new WeakMap<SVGElement, { active: boolean }>();

const defaultEase = [0.25, 0.1, 0.35, 1] as const;

export function createStaggeredRevealRecipe(steps: RevealStep[], finish: IconRecipe["finish"] = "hold"): IconRecipe {
  return {
    finish,
    animate(drawing, returning, track) {
      for (const step of steps) {
        const shape = drawing.children[step.child - 1] as SVGGeometryElement;
        const delay = returning ? step.returnDelay ?? 0 : step.delay;
        const opacityDelay = returning ? delay : step.opacityDelay ?? delay;
        if (step.opacityOnly) {
          const interrupted = step.preservePose && opacityPlaybacks.get(shape)?.active;
          const playback = { active: true };
          if (step.preservePose) opacityPlaybacks.set(shape, playback);
          track((onComplete) => animate(shape, { opacity: returning ? 1 : [interrupted && shape.style.opacity ? shape.style.opacity : 0, 1] }, {
            duration: 0.3, delay: opacityDelay, ease: returning ? defaultEase : step.opacityEase ?? defaultEase,
            onComplete() { if (step.preservePose !== "until-clear") playback.active = false; onComplete(); },
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
      for (const step of steps) {
        const shape = drawing.children[step.child - 1] as SVGGeometryElement;
        opacityPlaybacks.delete(shape);
        clearPathReveal(shape);
      }
    },
  };
}
