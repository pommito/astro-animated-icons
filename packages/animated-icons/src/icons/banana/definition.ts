import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const bananaRecipe = createSvgPartsRecipe([2, 0].map((custom, index) => ({
  selector: `[data-part='${index}']`,
  transition: { duration: 0.3, delay: 0.1, opacity: { delay: 0.15 } },
  variants: {
    normal: { pathLength: 1, opacity: 1 },
    animate: {
      pathLength: [0, 1], opacity: [0, 1],
      transition: { delay: custom * 0.1 },
    },
  },
})));
