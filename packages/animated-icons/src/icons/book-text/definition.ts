import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const bookTextRecipe = createSvgPartsRecipe([{
  selector: "svg",
  variants: {
    normal: { scale: 1, rotate: 0, y: 0 },
    animate: {
      scale: [1, 1.04, 1], rotate: [0, -8, 8, -8, 0], y: [0, -2, 0],
      transition: { duration: 0.6, ease: "easeInOut", times: [0, 0.2, 0.5, 0.8, 1] },
    },
  },
}]);
