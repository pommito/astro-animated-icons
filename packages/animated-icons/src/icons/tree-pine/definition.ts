import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const treePineRecipe = createSvgPartsRecipe([{
  selector: "svg", transition: { duration: 0.5, ease: "easeInOut" },
  variants: {
    normal: { rotate: 0 },
    animate: { rotate: [0, -10, 10, -10, 0] },
  },
}]);
