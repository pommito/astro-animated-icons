import { createAlignmentRecipe } from "../../shared/alignment";

export const alignHorizontalRecipe = createAlignmentRecipe([
  { scaleX: 0.85 }, { translateX: 2, scaleY: 0.9 }, { translateX: -2, scaleY: 0.9 },
]);
