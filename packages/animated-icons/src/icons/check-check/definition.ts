import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const checkCheckRecipe = createSvgPartsRecipe([
  {
    selector: "[data-part='0']",
    variants: {
      normal: { opacity: 1, pathLength: 1, scale: 1, transition: { duration: 0.3, opacity: { duration: 0.1 } } },
      animate: {
        opacity: [0, 1],
        pathLength: [0, 1],
        scale: [0.5, 1],
        transition: { duration: 0.4, opacity: { duration: 0.1 }, delay: 0 },
      },
    },
  },
  {
    selector: "[data-part='1']",
    variants: {
      normal: { opacity: 1, pathLength: 1, scale: 1, transition: { duration: 0.3, opacity: { duration: 0.1 } } },
      animate: {
        opacity: [0, 1],
        pathLength: [0, 1],
        scale: [0.5, 1],
        transition: { duration: 0.4, opacity: { duration: 0.1 }, delay: 0.1 },
      },
    },
  },
]);
