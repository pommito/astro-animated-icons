import { createResizeRecipe } from "../../shared/resize";

export const shrinkRecipe = createResizeRecipe([
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
]);
