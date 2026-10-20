import { createSquareArrowRecipe } from "../../shared/square-arrow";

export const squareArrowUpRecipe = createSquareArrowRecipe({
  axis: "y",
  distance: 3,
  shaft: ["M12 16V8", "M12 16V13", "M12 16V8"],
});
