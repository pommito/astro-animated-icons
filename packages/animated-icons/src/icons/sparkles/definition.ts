import { animate } from "motion";
import type { IconRecipe } from "../../element";
import { createSvgPartsRecipe } from "../../shared/svg-parts";

const parts = createSvgPartsRecipe([
  {
    selector: "[data-part='0']",
    variants: {
      normal: { y: 0 },
      animate: { y: [0, -1, 0, 0], transition: { duration: 1 } },
    },
  },
  {
    selector: "[data-part]:not([data-part='0'])",
    variants: {
      normal: { opacity: 1 },
      animate: {
        opacity: [0, 1, 0, 0, 0, 0, 1],
        // The upstream start override replaces the variant's multiframe spring.
        transition: { duration: 0.8, ease: "easeOut", delay: 1 },
      },
    },
  },
]);

export const sparklesRecipe: IconRecipe = {
  finish: "hold",
  animate(drawing, returning, track) {
    parts.animate(drawing, returning, track);
    const sparkle = drawing.querySelector<SVGPathElement>("[data-part='0']")!;
    track(onComplete => {
      const animation = animate(sparkle, { fill: returning ? "none" : "currentColor" }, {
        duration: returning ? 0.3 : 1,
        ease: returning ? [0.25, 0.1, 0.35, 1] : "easeOut",
        onComplete,
      });
      return { stop: () => animation.stop(), cancel: () => animation.stop() };
    });
  },
  clear(drawing) {
    parts.clear(drawing);
    drawing.querySelector<SVGPathElement>("[data-part='0']")!.style.removeProperty("fill");
  },
};
