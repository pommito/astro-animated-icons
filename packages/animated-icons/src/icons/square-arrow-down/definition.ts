import { createSquareArrowRecipe } from "../../shared/square-arrow";

export const squareArrowDownRecipe = createSquareArrowRecipe({
  axis: "y",
  distance: -3,
  shaft: ["M12 8v8", "M12 8v5", "M12 8v8"],
});
