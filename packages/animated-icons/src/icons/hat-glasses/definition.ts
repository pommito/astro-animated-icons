import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const hatGlassesRecipe = createSvgPartsRecipe([
  {
    selector: "[data-hat]", origin: "12px 11px", transformBox: "fill-box",
    variants: {
      normal: { rotate: 0, y: 0 },
      animate: {
        rotate: [0, -4, 2, 0], y: [0, -3, 1, 0],
        transition: { duration: 0.5, ease: "easeOut", times: [0, 0.35, 0.65, 1] },
      },
    },
  },
  {
    selector: "[data-glasses]", origin: "center", transformBox: "fill-box",
    variants: {
      normal: { scale: 1, y: 0 },
      animate: {
        scale: [1, 0.96, 1], y: [0, 1, 0],
        transition: { delay: 0.28, duration: 0.32, ease: "easeInOut" },
      },
    },
  },
]);
