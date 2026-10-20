import { createSvgAttributeRecipe } from "../../shared/svg-attributes";

export const alignRightRecipe = createSvgAttributeRecipe([
  { normal: { x1: 3 }, animate: { x1: 3 } },
  { normal: { x1: 9 }, animate: { x1: 5 } },
  { normal: { x1: 7 }, animate: { x1: 12 } },
], { stiffness: 150, damping: 15, mass: 0.3 });
