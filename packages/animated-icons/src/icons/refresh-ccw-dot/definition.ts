import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const refreshCcwDotRecipe = createSvgPartsRecipe([{
  selector: "[data-spin]",
  variants: { normal: { rotate: 0 }, animate: { rotate: -50 } },
  transition: { type: "spring", stiffness: 250, damping: 25 },
}]);
