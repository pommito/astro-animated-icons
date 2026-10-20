import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const variants: SvgVariants = {
  normal: { rotate: 0 },
  animate: {
    rotate: [0, -15, 10, -5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
};

export const handRecipe = createSvgPartsRecipe([
  { selector: "svg", variants, origin: "50% 90%" },
]);
