import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const hammerRecipe = createSvgPartsRecipe([{
  selector: "svg", origin: "0% 100%", transformBox: "fill-box",
  variants: {
    normal: { rotate: 0, transition: { duration: 0.3, ease: "easeOut" } },
    animate: {
      rotate: [0, -20, 25, 0],
      transition: { duration: 0.8, times: [0, 0.6, 0.8, 1], ease: ["easeInOut", "easeOut", "easeOut"] },
    },
  },
}]);
