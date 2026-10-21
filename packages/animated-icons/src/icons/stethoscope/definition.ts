import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const stethoscopeRecipe = createSvgPartsRecipe([0, 1, 2, 3, 4].map(index => {
  const delay = [0.6, 0.6, 0.6, 0.35, 0.1][index];
  return {
    selector: `[data-part='${index}']`,
    transition: { duration: 0.25, delay, opacity: { delay } },
    variants: {
      normal: { pathLength: 1, ...(index < 4 ? { pathOffset: 0 } : {}), opacity: 1, transition: { delay: 0 } },
      animate: { pathLength: [0, 1], ...(index < 4 ? { pathOffset: [1, 0] } : {}), opacity: [0, 1] },
    },
  };
}));
