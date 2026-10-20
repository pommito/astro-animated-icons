import type { IconRecipe } from "../element";
import { animateSvgTransform, clearSvgTransform } from "./svg-transform";

type Targets = Parameters<typeof animateSvgTransform>[3];

export function createDirectionalPulseRecipe(motions: readonly (Targets | null)[], duration: number, ease: "easeInOut" | "easeOut"): IconRecipe {
  return {
    finish: "restore",
    animate(drawing, returning, track) {
      const paths = drawing.querySelectorAll("path");
      motions.forEach((targets, index) => {
        if (!targets) return;
        animateSvgTransform(paths[index], returning, track, targets, returning
          ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
          : { duration, ease },
          returning ? { scale: { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 } } : {},
        );
      });
    },
    clear(drawing) {
      drawing.querySelectorAll("path").forEach(clearSvgTransform);
    },
  };
}
