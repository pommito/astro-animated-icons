import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const cookingPotRecipe = createSvgPartsRecipe([
  {
    selector: "[data-pot]", origin: "center", transformBox: "fill-box",
    variants: {
      normal: { scale: 1 },
      animate: { scale: [1, 1.08, 1], transition: { duration: 0.95, ease: "easeInOut" } },
    },
  },
  {
    selector: "[data-lid]", origin: "center", transformBox: "fill-box",
    variants: {
      normal: { rotate: 0 },
      animate: {
        rotate: [0, -14, 14, -10, 10, -6, 6, 0],
        transition: { duration: 0.9, ease: "easeInOut" },
      },
    },
  },
]);
