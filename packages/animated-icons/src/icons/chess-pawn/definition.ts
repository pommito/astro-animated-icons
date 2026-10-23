import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const chessPawnRecipe = createSvgPartsRecipe([
  {
    selector: "[data-body]",
    variants: {
      normal: { rotate: 0, transition: { type: "spring", stiffness: 260, damping: 16 } },
      animate: { rotate: [0, 5, 5, 5, 3, 0], transition: { duration: 1.8, times: [0, 0.08, 0.3, 0.52, 0.72, 1], ease: "easeInOut" } },
    },
  },
  {
    selector: "circle",
    variants: {
      normal: { x: 0, y: 0, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 180, damping: 16 } },
      animate: { x: [0, -5, 5, 0], rotate: [0, -15, 15, 0], transition: { duration: 2.4, times: [0, 0.33, 0.66, 1], ease: "easeInOut" } },
    },
  },
]);
