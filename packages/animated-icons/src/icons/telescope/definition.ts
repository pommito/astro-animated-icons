import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const telescopeRecipe = createSvgPartsRecipe([{
  selector: "[data-scope]", origin: "12px 13px",
  variants: {
    normal: { rotate: 0, transition: { duration: 0.6, ease: "easeInOut" } },
    animate: { rotate: -15, transition: { duration: 0.8, ease: "easeInOut" } },
  },
}]);
