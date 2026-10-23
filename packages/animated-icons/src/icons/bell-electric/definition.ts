import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const bellElectricRecipe = createSvgPartsRecipe([
  {
    selector: "svg", origin: "50% 50%", transformBox: "fill-box",
    transition: { duration: 0.9 },
    variants: {
      normal: { rotate: 0, translateX: 0, y: 0 },
      animate: {
        rotate: [0, -12, 12, -8, 8, 0],
        translateX: [0, -1.5, 1.5, -1, 1, 0], y: [0, -1, 1, -0.5, 0.5, 0],
      },
    },
  },
  {
    selector: "[data-part='1']", transition: { duration: 0.9 },
    variants: {
      normal: { translateX: 0, y: 0, rotate: 0 },
      animate: {
        translateX: [0, -0.8, 0.8, -0.6, 0.6, 0],
        y: [0, -0.5, 0.5, -0.3, 0.3, 0], rotate: [0, -6, 6, -4, 4, 0],
      },
    },
  },
  {
    selector: "[data-part='2']", transition: { duration: 0.75 },
    variants: {
      normal: { translateX: 0, y: 0, rotate: 0, scale: 1 },
      animate: {
        translateX: [0, -1.6, 1.6, -1.2, 1.2, 0],
        y: [0, -1.2, 1.2, -0.8, 0.8, 0], rotate: [0, -10, 10, -7, 7, 0],
        scale: [1, 1.08, 0.95, 1.06, 0.98, 1],
      },
    },
  },
]);
