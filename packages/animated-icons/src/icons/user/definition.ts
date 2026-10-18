import type { IconRecipe } from "../../element";
import { animatePathReveal, clearPathReveal } from "../../shared/path-reveal";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const userRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const circle = drawing.querySelector("circle")!;
    const path = drawing.querySelector("path")!;
    animatePathReveal(circle, returning, track, {
      duration: 0.3, ease: [0.25, 0.1, 0.35, 1], reverseOffset: true,
    });
    animateSvgTransform(circle, returning, track, { scale: [0.5, 1] },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
    animatePathReveal(path, returning, track, {
      duration: 0.4, delay: 0.2, ease: "easeOut", reverseOffset: true, opacityDuration: 0.4,
    });
  },
  clear(drawing) {
    clearPathReveal(drawing.querySelector("circle")!);
    clearSvgTransform(drawing.querySelector("circle")!);
    clearPathReveal(drawing.querySelector("path")!);
  },
} satisfies IconRecipe;
