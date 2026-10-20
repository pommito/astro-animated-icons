import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const gaugeRecipe = createSvgPartsRecipe([{
  selector: "[data-part='0']",
  transition: { type: "spring", stiffness: 160, damping: 17, mass: 1 },
  variants: {
    normal: { translateX: 0, y: 0, rotate: 0 },
    animate: { translateX: 0.5, y: 3, rotate: 72 },
  },
}]);
