import { createSvgPartsRecipe } from "../../shared/svg-parts";

export const cursorClickRecipe = createSvgPartsRecipe([
  {
    selector: "[data-part='0']",
    variants: { normal: { x: 0, y: 0 }, animate: { x: [0, 0, -3, 0], y: [0, -4, 0, 0], transition: { duration: 1 } } },
  },
  ...[{ x: 1, y: -1 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -1 }].map(({ x, y }, index) => ({
    selector: `[data-part='${index + 1}']`,
    variants: {
      normal: { opacity: 1, x: 0, y: 0 },
      animate: {
        opacity: [0, 1, 0, 0, 0, 0, 1], x: [0, x, 0, 0], y: [0, y, 0, 0],
        transition: { duration: 0.8, ease: "easeOut" as const, delay: 1.3 },
      },
    },
  })),
]);
