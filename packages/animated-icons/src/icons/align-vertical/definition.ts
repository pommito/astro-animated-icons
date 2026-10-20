import { createAlignmentRecipe } from "../../shared/alignment";

export const alignVerticalRecipe = createAlignmentRecipe([
  { scaleY: 0.8 }, { y: -2, scaleX: 0.9 }, { y: 2, scaleX: 0.9 },
]);
