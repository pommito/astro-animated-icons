import { createSvgAttributeRecipe } from "../../shared/svg-attributes";

export const alignLeftRecipe = createSvgAttributeRecipe([
  { normal: { x2: 21 }, animate: { x2: 21 } },
  { normal: { x2: 15 }, animate: { x2: 19 } },
  { normal: { x2: 17 }, animate: { x2: 12 } },
], { stiffness: 150, damping: 15, mass: 0.3 });
