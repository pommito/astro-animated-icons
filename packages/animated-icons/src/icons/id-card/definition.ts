import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const idCardRecipe = createSvgPartsRecipe([2, 2, 0, 1].map((custom, index) => ({
  selector: `[data-part='${index}']`,
  variants: {
    normal: { pathLength: 1, opacity: 1 },
    animate: { pathLength: [0, 1], opacity: [0, 1], transition: { duration: 0.3, delay: custom * 0.1 } },
  },
})));
