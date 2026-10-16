import { animate } from "motion/mini";
import type { IconRecipe } from "../element";

interface GripMotion {
  opacity: number[];
  scale?: number[];
  duration: number;
  times: number[];
  ease: "easeOut" | "easeInOut";
  delay(index: number): number;
}

export function gripWaveDelay(index: number) {
  return (index % 3) * 0.15 + Math.floor(index / 3) * 0.25;
}

export function createGripRecipe(motion: GripMotion): IconRecipe {
  return {
    finish: "restore",
    animate(drawing, returning, track) {
      drawing.querySelectorAll("circle").forEach((circle, index) => {
        const transition = returning
          ? { duration: 0.25, ease: "easeOut" as const }
          : {
            delay: motion.delay(index),
            duration: motion.duration,
            ease: motion.opacity.slice(1).map(() => motion.ease),
            times: motion.times,
          };
        track((onComplete) => animate(circle, {
          opacity: returning ? 1 : motion.opacity,
        }, { ...transition, onComplete }));
        const scales = motion.scale;
        if (scales) {
          track((onComplete) => animate(circle, {
            transform: returning ? "scale(1)" : scales.map((scale) => `scale(${scale})`),
          }, { ...transition, onComplete }));
        }
      });
    },
    clear(drawing) {
      drawing.querySelectorAll("circle").forEach((circle) => {
        circle.style.removeProperty("opacity");
        if (motion.scale) circle.style.removeProperty("transform");
      });
    },
  };
}
