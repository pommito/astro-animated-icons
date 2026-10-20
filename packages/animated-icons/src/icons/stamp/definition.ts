import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const stampRecipe = createSvgPartsRecipe([
  {
    selector: "[data-part='0'], [data-part='1']",
    variants: {
      normal: { y: 0, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
      animate: { y: [0, 4, 4, -1, 0], transition: { duration: 0.8, ease: "easeInOut", times: [0, 0.35, 0.65, 0.82, 1] } },
    },
  },
  {
    selector: "[data-part='2']",
    variants: {
      normal: { opacity: 1, scaleX: 1, transition: { duration: 0.4 } },
      animate: { opacity: [1, 0.4, 1.4, 1], scaleX: [1, 0.85, 0.85, 1], transition: { duration: 0.8, ease: "easeInOut", times: [0, 0.35, 0.65, 1] } },
    },
  },
]);
