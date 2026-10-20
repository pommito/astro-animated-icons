import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const treeDeciduousRecipe = createSvgPartsRecipe([{
  selector: "svg", origin: "12px 21px",
  variants: {
    normal: { rotate: 0 },
    animate: { rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5, ease: "easeInOut" } },
  },
}]);
