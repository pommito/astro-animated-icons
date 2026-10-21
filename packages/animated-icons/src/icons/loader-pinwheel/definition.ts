import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const loaderPinwheelRecipe = createSvgPartsRecipe([{
  selector: "[data-spin]",
  variants: {
    normal: { rotate: 0 },
    animate: { rotate: 360, transition: { duration: 1, ease: "linear", repeat: Infinity, preserveCycleEnd: true } },
  },
  transition: { type: "spring", stiffness: 50, damping: 10 },
}]);
