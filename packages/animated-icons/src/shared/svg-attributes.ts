import { animate, svgEffect } from "motion";
import type { IconRecipe } from "../element";

interface AttributePose {
  normal: Record<string, number>;
  animate: Record<string, number>;
}

export function createSvgAttributeRecipe(poses: AttributePose[], transition: { stiffness: number; damping: number; mass: number }): IconRecipe {
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      drawing.querySelectorAll("line").forEach((line, index) => {
        track((onComplete) => {
          const animation = animate(line, returning ? poses[index].normal : poses[index].animate, {
            type: "spring", ...transition, onComplete,
          });
          // Attribute cancellation must preserve the current pose instead of rewinding it.
          return { stop: () => animation.stop(), cancel: () => animation.stop() };
        });
      });
    },
    clear(drawing) {
      drawing.querySelectorAll("line").forEach((line, index) => {
        svgEffect.state(line)?.release();
        for (const [attribute, value] of Object.entries(poses[index].normal)) line.setAttribute(attribute, String(value));
      });
    },
  };
}
