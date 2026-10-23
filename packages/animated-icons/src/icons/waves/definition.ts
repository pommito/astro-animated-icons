import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const wavesRecipe = createSvgPartsRecipe([{
  selector: "path",
  variants: {
    normal: { pathLength: 1 },
    animate: { pathLength: [0, 1], transition: { duration: 0.4, ease: "linear" } },
  },
}]);
