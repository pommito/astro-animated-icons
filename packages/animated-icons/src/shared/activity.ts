import { createSvgPartsRecipe, type SvgVariants } from "./svg-parts";

export const activityVariants = {
  normal: { opacity: 1, pathLength: 1, pathOffset: 0, transition: { duration: 0.4, opacity: { duration: 0.1 } } },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: { duration: 0.6, ease: "linear", opacity: { duration: 0.1 } },
  },
} satisfies SvgVariants;

export const activityRecipe = createSvgPartsRecipe([{ selector: "path", variants: activityVariants }]);
