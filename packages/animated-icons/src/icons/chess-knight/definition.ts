import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const chessKnightRecipe = createSvgPartsRecipe([{
  selector: "[data-piece]",
  variants: {
    normal: { rotate: 0, y: 0, transition: { type: "spring", stiffness: 220, damping: 12 } },
    animate: {
      rotate: [0, 12, 38, 42, 38, 10, -5, 0], y: [0, -2, -9, -12, -9, -2, 1, 0],
      transition: { duration: 0.9, times: [0, 0.1, 0.3, 0.45, 0.6, 0.78, 0.9, 1], ease: "easeInOut" },
    },
  },
}]);
