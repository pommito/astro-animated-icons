import type { IconRecipe } from "../../element";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

export const userPlusRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    const plus = drawing.querySelector<SVGGElement>("[data-plus]")!;
    const transition = {
      duration: returning ? 0.3 : 0.45,
      delay: returning ? 0 : 0.25,
      ease: "easeOut" as const,
      times: returning ? undefined : [0, 0.7, 1],
    };
    animateSvgTransform(plus, returning, track,
      { scale: [0, 1.15, 1], rotate: [-90, 0, 0] },
      transition,
    );
    track((onComplete) => animate(plus, { opacity: returning ? 1 : [0, 1, 1] }, { ...transition, onComplete }));
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector<SVGGElement>("[data-plus]")!);
  },
} satisfies IconRecipe;
import { animate } from "motion/mini";
