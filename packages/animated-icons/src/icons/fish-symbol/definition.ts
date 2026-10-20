import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const fishSymbolRecipe = createSvgPartsRecipe([{
  selector: "path",
  variants: {
    normal: { pathLength: 1, opacity: 1 },
    animate: {
      pathLength: [0, 1], opacity: [0, 1],
      transition: { delay: 0.15, opacity: { delay: 0.1 } },
    },
  },
}]);
