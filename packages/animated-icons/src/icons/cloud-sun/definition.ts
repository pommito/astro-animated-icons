import type { IconRecipe } from "../../element";
import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

const rays = createStaggeredRevealRecipe(
  Array.from({ length: 5 }, (_, index) => ({ child: index + 2, delay: (index + 1) * 0.1, opacityOnly: true, opacityEase: "easeOut" as const })),
);

export const cloudSunRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    animateSvgTransform(drawing.querySelector<SVGGElement>('[data-motion="0"]')!, returning, track,
      { x: [-1, 1, -1, 1, 0], y: [-1, 1, -1, 1, 0] },
      returning
        ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 }
        : { duration: 1, ease: "easeInOut" },
    );
    rays.animate(drawing, returning, track);
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGGElement>('[data-motion="0"]')!);
    rays.clear(drawing);
  },
} satisfies IconRecipe;
