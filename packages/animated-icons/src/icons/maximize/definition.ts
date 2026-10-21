import { createResizeRecipe } from "../../shared/resize";

export const maximizeRecipe = createResizeRecipe([
  [-2, -2],
  [2, -2],
  [-2, 2],
  [2, 2],
]);
