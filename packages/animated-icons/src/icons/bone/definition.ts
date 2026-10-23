import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const boneRecipe = createSvgPartsRecipe([{
  selector: "[data-bone]", origin: "center", transformBox: "fill-box",
  variants: {
    normal: { rotate: 0 },
    animate: { rotate: [0, -8, 8, -6, 0], transition: { duration: 0.5, ease: "easeOut" } },
  },
}]);
