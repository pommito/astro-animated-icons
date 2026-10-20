import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const link2Recipe = createSvgPartsRecipe([
  {
    selector: "[data-part='0']",
    variants: {
      normal: { x: 0 },
      animate: { x: [0, -0.7, 0.3, 0], transition: { duration: 0.6, times: [0, 0.4, 0.75, 1], ease: "easeInOut" } },
    },
  },
  {
    selector: "[data-part='1']",
    variants: {
      normal: { x: 0 },
      animate: { x: [0, 0.7, -0.3, 0], transition: { duration: 0.6, times: [0, 0.4, 0.75, 1], ease: "easeInOut" } },
    },
  },
]);
