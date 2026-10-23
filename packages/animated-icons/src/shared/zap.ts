import { createSvgPartsRecipe } from "./svg-parts";

export const zapRecipe = createSvgPartsRecipe([{
  selector: "path",
  variants: {
    normal: {
      opacity: 1, pathLength: 1,
      transition: { duration: 0.6, opacity: { duration: 0.1 } },
    },
    animate: {
      opacity: [0, 1], pathLength: [0, 1],
      transition: { duration: 0.6, opacity: { duration: 0.1 } },
    },
  },
}]);
