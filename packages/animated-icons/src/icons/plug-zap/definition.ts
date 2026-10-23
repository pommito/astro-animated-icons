import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const plugZapRecipe = createSvgPartsRecipe([{
  selector: "[data-zap]",
  variants: {
    normal: { opacity: 1 },
    animate: {
      opacity: [1, 0.4, 1],
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
    },
  },
}]);
