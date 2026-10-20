import { createSvgPartsRecipe } from "./svg-parts";

export const deviceCheckRecipe = createSvgPartsRecipe([{
  selector: "[data-motion]",
  variants: {
    normal: { pathLength: 1, opacity: 1, transition: { duration: 0.3 } },
    animate: {
      pathLength: [0, 1], opacity: [0, 1],
      transition: {
        pathLength: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.4, ease: "easeInOut" },
      },
    },
  },
}]);
