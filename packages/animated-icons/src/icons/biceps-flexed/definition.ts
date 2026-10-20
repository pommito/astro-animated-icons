import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const BICEPS_FLEXED_SVG_VARIANTS: SvgVariants = {
  normal: {
    rotate: 0,
  },
  animate: {
    rotate: [0, 15, 0],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Number.POSITIVE_INFINITY,
    },
  },
};

const BICEPS_FLEXED_PATH_VARIANTS: SvgVariants = {
  normal: {
    rotate: 0,
    scale: 1,
  },
  animate: {
    rotate: [0, 15, 0],
    scale: [1, 1.3, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Number.POSITIVE_INFINITY,
    },
  },
};

export const bicepsFlexedRecipe = createSvgPartsRecipe([
  { selector: "[data-part=path-1]", variants: BICEPS_FLEXED_PATH_VARIANTS },
  { selector: "[data-part=path-2], [data-part=path-3]", variants: BICEPS_FLEXED_SVG_VARIANTS },
]);
