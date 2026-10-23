import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const rabbitRecipe = createSvgPartsRecipe([{
  selector: "svg",
  variants: {
    normal: { rotate: 0, x: 0, y: 0 },
    animate: {
      rotate: [0, 5, -5, 3, -3, 0],
      x: [0, 3, -3, 2, -2, 0],
      y: [0, 1.5, -1.5, 1, -1, 0],
      transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] },
    },
  },
}]);
