import { createResizeRecipe } from "../../shared/resize";

export const expandRecipe = createResizeRecipe([
  [2, 2],
  [-2, 2],
  [2, -2],
  [-2, -2],
]);
