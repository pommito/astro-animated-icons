import { createSvgPartsRecipe } from "../../shared/svg-parts";

const transition = { type: "spring" as const, stiffness: 300, damping: 20 };

export const ticketRecipe = createSvgPartsRecipe([
  {
    selector: "[data-left]", transition,
    variants: { normal: { x: 0 }, animate: { x: -3 } },
  },
  {
    selector: "[data-right]", transition,
    variants: { normal: { x: 0, rotate: 0 }, animate: { x: 3, rotate: 4 } },
  },
]);
