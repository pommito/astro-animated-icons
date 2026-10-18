import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const menuRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    drawing.querySelectorAll("line").forEach((line, index) => {
      animateSvgTransform(line, returning, track,
        index === 1 ? { opacity: 0 } : { rotate: index === 0 ? 45 : -45, y: index === 0 ? 6 : -6 },
        returning ? index === 1
          ? { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] }
          : { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
          : { type: "spring", stiffness: 260, damping: 20 },
      );
    });
  },
  clear(drawing) {
    drawing.querySelectorAll("line").forEach(clearSvgTransform);
  },
} satisfies IconRecipe;
