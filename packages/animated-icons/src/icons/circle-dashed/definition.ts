import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const circleDashedRecipe = createSvgPartsRecipe(Array.from({ length: 8 }, (_, index) => ({
  selector: `[data-part="${index}"]`,
  variants: {
    normal: { opacity: 1 },
    animate: { opacity: [0, 1], transition: { delay: (index + 1) * 0.1, duration: 0.3 } },
  },
})));
