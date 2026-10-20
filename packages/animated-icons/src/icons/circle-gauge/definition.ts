import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const circleGaugeRecipe = createSvgPartsRecipe([{
  selector: "svg",
  variants: { normal: { rotate: 0 }, animate: { rotate: 72 } },
}]);
