import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const faceVariants: SvgVariants = {
  normal: { scale: 1 },
  animate: {
    scale: 1.1,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const plusVariants: SvgVariants = {
  normal: { rotate: 0, scale: 1 },
  animate: {
    rotate: 90,
    scale: 1.2,
    transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.1 },
  },
};

export const smilePlusRecipe = createSvgPartsRecipe([
  { selector: "svg", variants: faceVariants },
  { selector: "[data-part=plus]", variants: plusVariants },
]);
