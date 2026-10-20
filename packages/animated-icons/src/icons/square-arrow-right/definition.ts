import { createSquareArrowRecipe } from "../../shared/square-arrow";

export const squareArrowRightRecipe = createSquareArrowRecipe({
  axis: "translateX",
  distance: -3,
  shaft: ["M8 12h8", "M8 12h5", "M8 12h8"],
});
