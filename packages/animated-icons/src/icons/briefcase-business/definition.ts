import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const briefcaseBusinessRecipe = createSvgPartsRecipe([{
  selector: "svg", origin: "12px 4px",
  variants: {
    normal: { rotate: 0, transition: { duration: 0.3, ease: "easeOut" } },
    animate: { rotate: [0, 4, -3, 2, 0], transition: { duration: 0.9, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] } },
  },
}]);
