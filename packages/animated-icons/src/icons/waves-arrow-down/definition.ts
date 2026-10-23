import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const wavesArrowDownRecipe = createSvgPartsRecipe([
  {
    selector: "[data-part='0']",
    variants: {
      normal: { y: 0, scale: 1 },
      animate: { y: [0, 3, 0], scale: [1, 0.85, 1], transition: { duration: 0.5, ease: "easeInOut" } },
    },
  },
  {
    selector: "[data-part='1']",
    variants: {
      normal: { y: 0 },
      animate: { y: [0, 3, 0], transition: { duration: 0.5, ease: "easeInOut" } },
    },
  },
]);
