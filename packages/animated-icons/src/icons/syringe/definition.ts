import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const syringeRecipe = createSvgPartsRecipe([{
  selector: "svg",
  transition: { type: "spring", stiffness: 250, damping: 25 },
  variants: {
    normal: { translateX: 0, y: 0, rotate: 0 },
    animate: { translateX: -3, y: 3, rotate: 1 },
  },
}]);
