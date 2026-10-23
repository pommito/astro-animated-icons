import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const chessKingRecipe = createSvgPartsRecipe([{
  selector: "[data-piece]",
  variants: {
    normal: { rotate: 0, y: 0, transition: { type: "spring", stiffness: 160, damping: 14 } },
    animate: {
      rotate: [0, -10, 10, -6, 6, -2, 0], y: [0, -3, -3, -2, -2, -1, 0],
      transition: { duration: 1.1, times: [0, 0.18, 0.38, 0.55, 0.7, 0.85, 1], ease: "easeInOut" },
    },
  },
}]);
