import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const rollerCoasterRecipe = createSvgPartsRecipe([0, 0, 0, 0, 0, 0, 2].map((custom, index) => ({
  selector: `[data-part='${index}']`,
  variants: {
    normal: { pathLength: 1, opacity: 1 },
    animate: {
      pathLength: [0, 1], opacity: [0, 1],
      transition: { delay: custom * 0.1, opacity: { delay: custom * 0.1 } },
    },
  },
})));
