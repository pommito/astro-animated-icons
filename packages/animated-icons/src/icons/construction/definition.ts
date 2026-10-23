import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const constructionRecipe = createSvgPartsRecipe([{
  selector: "[data-stripes]",
  variants: {
    normal: { x: 0 },
    animate: { x: [0, 6], transition: { duration: 1, ease: "linear", repeat: Infinity } },
  },
}]);
