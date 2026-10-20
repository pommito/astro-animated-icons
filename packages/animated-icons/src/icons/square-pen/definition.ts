import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const squarePenRecipe = createSvgPartsRecipe([{
  selector: "[data-part='1']",
  variants: {
    normal: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: [-0.5, 0.5, -0.5], x: [0, -1, 1.5, 0], y: [0, 1.5, -1, 0],
      transition: { duration: 0.8, ease: "easeOut" },
    },
  },
}]);
