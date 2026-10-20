import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const HEART_VARIANTS: SvgVariants = {
  normal: {
    y: 0,
    transition: {
      delay: 0.1,
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
  },
  animate: {
    y: [0, -2],
    transition: {
      delay: 0.1,
      type: "spring",
      stiffness: 200,
      damping: 25,
    },
  },
};

const scale: SvgVariants = {
  normal: { scale: 1, transition: { duration: 0.2 } },
  animate: { scale: [1, 1.1], transition: { duration: 0.2 } },
};

export const handHeartRecipe = createSvgPartsRecipe([
  { selector: "[data-part=lift]", variants: HEART_VARIANTS },
  { selector: "[data-part=heart]", variants: scale },
]);
