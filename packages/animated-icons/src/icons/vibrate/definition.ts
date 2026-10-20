import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const vibrateRecipe = createSvgPartsRecipe([{
  selector: "rect",
  variants: {
    normal: { rotate: 0 },
    animate: { rotate: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1] } },
  },
}]);
