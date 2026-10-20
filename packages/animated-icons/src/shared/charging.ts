import { createSvgPartsRecipe } from "./svg-parts";

export const chargingRecipe = createSvgPartsRecipe([{
  selector: "[data-motion]",
  variants: {
    normal: { opacity: 1 },
    animate: { opacity: [1, 0.4, 1], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } },
  },
}]);
