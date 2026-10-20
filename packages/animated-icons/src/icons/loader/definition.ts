import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const loaderRecipe = createSvgPartsRecipe([{
  selector: "[data-spin]",
  variants: {
    normal: { rotate: 0 },
    animate: { rotate: 360, transition: { duration: 0.8, ease: "linear", repeat: Infinity, preserveCycleEnd: true } },
  },
  transition: { type: "spring", stiffness: 50, damping: 10 },
}]);
