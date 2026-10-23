import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const chromeRecipe = createSvgPartsRecipe([0, 3, 3, 3].map((custom, index) => ({
  selector: `[data-part='${index + 1}']`,
  variants: {
    normal: { pathLength: 1, opacity: 1 },
    animate: {
      pathLength: [0, 1], opacity: [0, 1],
      transition: { duration: 0.3, delay: custom * 0.1, opacity: { delay: 0.15 } },
    },
  },
})));
