import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const usersRoundRecipe = createSvgPartsRecipe([
  {
    selector: "[data-part='0']",
    variants: {
      normal: { translateX: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 13 } },
      animate: {
        translateX: [-4, 0], opacity: [0, 1],
        transition: { type: "spring", stiffness: 200, damping: 13, delay: 0.1 },
      },
    },
  },
]);
