import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const earthRecipe = createSvgPartsRecipe([
  {
    selector: "path",
    transition: { duration: 0.7, delay: 0.5, opacity: { delay: 0.5 } },
    variants: {
      normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
      animate: { pathLength: [0, 1], opacity: [0, 1], pathOffset: [1, 0] },
    },
  },
  {
    selector: "circle",
    transition: { duration: 0.3, delay: 0.1, opacity: { delay: 0.15 } },
    variants: {
      normal: { pathLength: 1, opacity: 1 },
      animate: { pathLength: [0, 1], opacity: [0, 1] },
    },
  },
]);
