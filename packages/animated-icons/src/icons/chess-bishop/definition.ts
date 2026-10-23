import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const chessBishopRecipe = createSvgPartsRecipe([{
  selector: "[data-piece]",
  variants: {
    normal: { x: 0, y: 0, rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 220, damping: 18 } },
    animate: {
      x: [0, -6, -6, -6, 6, 6, 6, 0], y: [0, -6, -6, -6, 6, 6, 6, 0],
      rotate: [0, -16, -16, -16, 16, 16, 4, 0], opacity: [1, 1, 0, 0, 0, 0, 1, 1],
      transition: { duration: 1.4, times: [0, 0.28, 0.38, 0.45, 0.5, 0.58, 0.72, 1], ease: "easeInOut" },
    },
  },
}]);
