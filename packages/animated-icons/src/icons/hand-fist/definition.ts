import { createSvgPartsRecipe, type SvgVariants } from "../../shared/svg-parts";

const variants: SvgVariants = {
  normal: { y: 0, scale: 1 },
  animate: {
    y: [0, -4, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      repeat: 1,
      repeatType: "reverse",
    },
  },
};

export const handFistRecipe = createSvgPartsRecipe([
  { selector: "svg", variants },
]);
