import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const featherRecipe = createSvgPartsRecipe([{
  selector: "svg",
  variants: {
    normal: { rotate: 0, y: 0, x: 0 },
    animate: {
      rotate: [0, -8, 4, -3, 0], y: [0, -4, -2, -1, 0], x: [0, 2, -2, 1, 0],
      transition: { duration: 1.6, ease: "easeInOut" },
    },
  },
}]);
