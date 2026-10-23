import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const contrastRecipe = createSvgPartsRecipe([{
  selector: "path",
  origin: "left center",
  transformBox: "fill-box",
  variants: {
    normal: { rotate: 0 },
    animate: { rotate: 180, transition: { type: "spring", stiffness: 80, damping: 12 } },
  },
}]);
