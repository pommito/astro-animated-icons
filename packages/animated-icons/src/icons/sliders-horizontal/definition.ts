import { createSvgAttributeRecipe } from "../../shared/svg-attributes";

const endpoints: Parameters<typeof createSvgAttributeRecipe>[0] = [
  { normal: { x2: 14 }, animate: { x2: 10 } },
  { normal: { x1: 10 }, animate: { x1: 5 } },
  { normal: { x2: 12 }, animate: { x2: 18 } },
  { normal: { x1: 8 }, animate: { x1: 13 } },
  { normal: { x2: 12 }, animate: { x2: 4 } },
  { normal: { x1: 16 }, animate: { x1: 8 } },
  { normal: { x1: 14, x2: 14 }, animate: { x1: 9, x2: 9 } },
  { normal: { x1: 8, x2: 8 }, animate: { x1: 14, x2: 14 } },
  { normal: { x1: 16, x2: 16 }, animate: { x1: 8, x2: 8 } },
];

export const slidersHorizontalRecipe = createSvgAttributeRecipe(endpoints, { stiffness: 100, damping: 12, mass: 0.4 });
