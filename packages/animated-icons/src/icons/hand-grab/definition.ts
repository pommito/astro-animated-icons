import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const variants: SvgVariants = {
  normal: { scale: 1 },
  animate: {
    scale: [1, 0.9, 1],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

export const handGrabRecipe = createSvgPartsRecipe([
  { selector: "svg", variants },
]);
