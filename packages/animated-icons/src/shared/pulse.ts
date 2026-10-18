import { animate } from "motion/mini";
import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

interface PulseOptions {
  scale: number[];
  opacity: number[];
  duration: number;
  repeat: number;
}

export function createPulseRecipe({ scale, opacity, duration, repeat }: PulseOptions): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      const pulse = drawing.querySelector<SVGElement>("[data-pulse]")!;
      animateSvgTransform(pulse, returning, track, { scale }, returning
        ? { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 }
        : { duration, ease: "easeInOut", repeat },
      );
      track((onComplete) => animate(pulse, { opacity: returning ? 1 : opacity }, {
        duration: returning ? 0.3 : duration,
        ease: returning ? [0.25, 0.1, 0.35, 1] : "easeInOut",
        repeat: returning ? 0 : repeat,
        onComplete,
      }));
    },
    clear(drawing) {
      clearSvgTransform(drawing.querySelector<SVGElement>("[data-pulse]")!);
    },
  };
}
