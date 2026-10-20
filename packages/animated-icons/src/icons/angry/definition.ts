import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const PATH_VARIANTS_FACE: SvgVariants = {
  normal: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.2, 1.2, 1.2, 1],
    rotate: [0, -3, 3, -1, 1, 0],
    transition: {
      duration: 0.6,
      times: [0, 0.2, 0.4, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

const PATH_VARIANTS_LEFT_EYEBROW: SvgVariants = {
  normal: { rotate: 0 },
  animate: {
    rotate: [0, 20, 0],
    transition: {
      duration: 0.8,
    },
  },
};

const PATH_VARIANTS_RIGHT_EYEBROW: SvgVariants = {
  normal: { rotate: 0 },
  animate: {
    rotate: [0, -20, 0],
    transition: {
      duration: 0.8,
    },
  },
};

const PATH_VARIANTS_EYE: SvgVariants = {
  normal: { scale: 1 },
  animate: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 0.6,
    },
  },
};

const PATH_VARIANTS_MOUTH: SvgVariants = {
  normal: { y: 0 },
  animate: {
    y: [0, -0.5, 0],
    transition: {
      duration: 0.6,
    },
  },
};

export const angryRecipe = createSvgPartsRecipe([
  { selector: "svg", variants: PATH_VARIANTS_FACE },
  { selector: "[data-part=mouth]", variants: PATH_VARIANTS_MOUTH },
  { selector: "[data-part=left-eyebrow]", variants: PATH_VARIANTS_LEFT_EYEBROW },
  { selector: "[data-part=right-eyebrow]", variants: PATH_VARIANTS_RIGHT_EYEBROW },
  { selector: "[data-part=left-eye]", variants: PATH_VARIANTS_EYE },
  { selector: "[data-part=right-eye]", variants: PATH_VARIANTS_EYE },
]);
