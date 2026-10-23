import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const boxRecipe = createSvgPartsRecipe([{
  selector: "path",
  variants: {
    normal: { opacity: 1, pathLength: 1, transition: { duration: 0.3, opacity: { duration: 0.1 } } },
    animate: { opacity: [0, 1], pathLength: [0, 1], transition: { duration: 0.4, opacity: { duration: 0.1 } } },
  },
}]);
