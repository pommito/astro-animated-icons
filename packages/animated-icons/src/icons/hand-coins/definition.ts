import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const CIRCLE_VARIANTS: SvgVariants = {
  normal: {
    y: 0,
    opacity: 1,
    transition: {
      opacity: { duration: 0.2 },
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
  animate: {
    opacity: [0, 1],
    y: [-20, 0],
    transition: {
      opacity: { duration: 0.2 },
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
};

const SECOND_CIRCLE_VARIANTS: SvgVariants = {
  normal: {
    y: 0,
    opacity: 1,
    transition: {
      opacity: { duration: 0.2 },
      delay: 0.15,
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
  animate: {
    opacity: [0, 1],
    y: [-20, 0],
    transition: {
      opacity: { duration: 0.2 },
      delay: 0.15,
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
};

export const handCoinsRecipe = createSvgPartsRecipe([
  { selector: "[data-part=coin-1]", variants: CIRCLE_VARIANTS },
  { selector: "[data-part=coin-2]", variants: SECOND_CIRCLE_VARIANTS },
]);
