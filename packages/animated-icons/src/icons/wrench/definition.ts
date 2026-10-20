import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const wrenchRecipe = createSvgPartsRecipe([{
  selector: "svg", origin: "90% 10%", transformBox: "fill-box",
  variants: {
    normal: { rotate: 0, transition: { duration: 0.25, ease: "easeOut" } },
    animate: {
      rotate: [0, 12, -14, 4, 0],
      transition: { duration: 1.05, times: [0, 0.42, 0.68, 0.88, 1], ease: ["easeInOut", "easeInOut", "easeOut", "easeOut"] },
    },
  },
}]);
