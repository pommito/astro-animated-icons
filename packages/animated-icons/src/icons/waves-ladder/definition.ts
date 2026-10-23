import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const wavesLadderRecipe = createSvgPartsRecipe([{
  selector: "[data-ladder]",
  variants: {
    normal: { y: 0, opacity: 1 },
    animate: {
      y: [13, 0], opacity: [0, 0, 1],
      transition: { duration: 1, times: [0, 0.5, 1] },
    },
  },
}]);
