import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const variants: SvgVariants = {
  normal: { rotate: 0 },
  animate: {
    rotate: [0, -15, 15, -10, 10, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

export const handMetalRecipe = createSvgPartsRecipe([
  { selector: "svg", variants, origin: "50% 90%" },
]);
