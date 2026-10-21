import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const atomRecipe = createSvgPartsRecipe([0, 0.3, 0.6].map((delay, index) => ({
  selector: `[data-part='${index}']`,
  transition: { duration: 0.4, ease: "easeInOut", delay },
  variants: {
    normal: { opacity: 1, pathLength: 1, pathOffset: 0 },
    animate: { opacity: [0, 1], pathLength: [0, 1], pathOffset: [1, 0] },
  },
})));
