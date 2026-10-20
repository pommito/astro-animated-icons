import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const flaskRecipe = createSvgPartsRecipe([
  {
    selector: "[data-lift]",
    variants: {
      normal: { y: 0 },
      animate: { y: -12, transition: { duration: 0.3, ease: "linear" } },
    },
  },
  {
    selector: "[data-bubbles]",
    variants: {
      normal: { rotate: 0 },
      animate: { rotate: [0, 5, -5, 3, -3, 0], transition: { duration: 0.8 } },
    },
  },
  {
    selector: "[data-scale]",
    variants: {
      normal: { scale: 1 },
      animate: { scale: 0.9, transition: { duration: 0.3, type: "spring", stiffness: 150, damping: 10 } },
    },
  },
  {
    selector: "[data-body]",
    variants: {
      normal: { rotate: 0 },
      animate: { rotate: [0, 6, -6, 3, -3, 0], transition: { duration: 0.8 } },
    },
  },
]);
