import { createSquareArrowRecipe } from "../../shared/square-arrow";

export const squareArrowLeftRecipe = createSquareArrowRecipe({
  axis: "translateX",
  distance: 3,
  shaft: ["M16 12H8", "M16 12H13", "M16 12H8"],
});
