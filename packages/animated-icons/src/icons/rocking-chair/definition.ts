import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const rockingChairRecipe = createSvgPartsRecipe([{
  selector: "svg",
  variants: {
    normal: { rotate: 0 },
    animate: { rotate: [-5, 5, -5], transition: { repeat: Infinity, repeatType: "reverse", duration: 1.2, ease: "easeInOut" } },
  },
}]);
