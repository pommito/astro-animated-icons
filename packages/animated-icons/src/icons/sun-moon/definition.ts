import type { IconRecipe } from "../../element";
import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

const rays = createStaggeredRevealRecipe(
  Array.from({ length: 8 }, (_, index) => ({
    child: index + 2, delay: (index + 1) * 0.1, opacityOnly: true, preservePose: "until-clear" as const, opacityEase: "easeOut" as const,
  })),
);

export const sunMoonRecipe = {
  finish: "restore",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector("g")!, returning, track, { rotate: [null, -5, 5, -2, 2, 0] }, returning
      ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
      : { duration: 1.5, ease: "easeInOut" });
    rays.animate(drawing, returning, track);
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector("g")!);
    rays.clear(drawing);
  },
} satisfies IconRecipe;
