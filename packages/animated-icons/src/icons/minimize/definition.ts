import { createResizeRecipe } from "../../shared/resize";

export const minimizeRecipe = createResizeRecipe([
  [2, 2],
  [-2, 2],
  [2, -2],
  [-2, -2],
]);
