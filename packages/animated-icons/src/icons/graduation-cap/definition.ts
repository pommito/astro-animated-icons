import type { IconRecipe } from "../../element";
import { animateSvgPart, clearSvgPart, type SvgPart } from "../../shared/svg-parts";
import { animateSvgTransform, clearSvgTransform } from "../../shared/svg-transform";

const tassel: SvgPart = {
  selector: "[data-tassel]",
  variants: {
    normal: { rotate: 0 },
    animate: { rotate: [0, 15, -10, 5, 0], transition: { duration: 0.8, ease: "easeInOut", delay: 0.1 } },
  },
};

export const graduationCapRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    // Upstream normal omits y, so its entry translation continues while rotation returns.
    animateSvgTransform(drawing.querySelector("[data-cap]")!, returning, track,
      { y: [null, -2, 0], rotate: [null, -2, 2, 0] },
      returning ? { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 } : { duration: 0.6, ease: "easeInOut" },
      returning ? { y: { continueOnReturn: true } } : {});
    animateSvgPart(drawing.querySelector("[data-tassel]")!, tassel, returning, track);
  },
  clear(drawing) {
    clearSvgTransform(drawing.querySelector("[data-cap]")!);
    clearSvgPart(drawing.querySelector("[data-tassel]")!, tassel);
  },
} satisfies IconRecipe;
