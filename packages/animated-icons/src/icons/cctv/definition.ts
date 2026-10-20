import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const cctvRecipe = createSvgPartsRecipe([
  {
    selector: "g[data-motion]",
    variants: {
      normal: { rotate: 0, y: 0, x: 0 },
      animate: {
        rotate: [0, -20, -20, 15, 15, 0], y: [0, -0.5, -0.5, 0, 0, 0], x: [0, 0, 0, 0.5, 0.5, 0],
        transition: { duration: 1.8, ease: "easeInOut" },
      },
    },
  },
  {
    selector: "path[data-motion]",
    variants: {
      normal: { opacity: 1 },
      animate: { opacity: [1, 0, 1, 0, 1, 0, 1], transition: { duration: 1.8, ease: "easeInOut" } },
    },
  },
]);
