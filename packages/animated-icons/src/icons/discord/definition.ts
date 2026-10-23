import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const discordRecipe = createSvgPartsRecipe([{
  selector: "path",
  variants: {
    normal: { translateX: 0, opacity: 1, transition: { duration: 0.2 } },
    animate: {
      translateX: [0, -2, 2, -2, 2, 0], opacity: 1,
      transition: { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeInOut" },
    },
  },
}]);
