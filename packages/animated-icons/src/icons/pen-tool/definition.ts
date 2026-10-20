import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const penToolRecipe = createSvgPartsRecipe([
  {
    selector: "svg", transition: { duration: 1, ease: "easeOut" },
    variants: {
      normal: { rotate: 0, translateX: 0, y: 0 },
      animate: { rotate: [0, 0, 8, -3, 8, 0], y: [0, 2, 0, -1, 0] },
    },
  },
  {
    selector: "[data-part='2']", transition: { duration: 0.8 },
    variants: {
      normal: { pathLength: 1, opacity: 1, pathOffset: 0 },
      animate: { pathLength: [0, 0, 1], opacity: [0, 1], pathOffset: [0, 1, 0] },
    },
  },
]);
