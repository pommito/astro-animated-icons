import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const accessibilityRecipe = createSvgPartsRecipe([
  {
    selector: "[data-part='0']",
    variants: {
      normal: { y: 0, x: 0 },
      animate: { y: [0, 1, -1, 0], x: [0, 1, -1, 0], transition: { duration: 0.8, ease: "easeInOut" } },
    },
  },
  {
    selector: "[data-part='1']",
    variants: {
      normal: { rotate: 0 },
      animate: { rotate: [0, 5, -5, 0], transition: { duration: 0.8, ease: "easeInOut" } },
    },
  },
  {
    selector: "[data-part='2']",
    variants: {
      normal: { rotate: 0, d: "M8 5 L5 8" },
      animate: {
        rotate: [0, -60, 0],
        d: ["M8 5 L5 8", "M8 5 L4 9", "M8 5 L5 8"],
        transition: { duration: 0.4, delay: 0.2, ease: "easeInOut" },
      },
    },
  },
  {
    selector: "[data-part='3']",
    variants: {
      normal: { rotate: 0 },
      animate: { rotate: -360, transition: { duration: 1, delay: 0.4, ease: "easeInOut" } },
    },
  },
]);
