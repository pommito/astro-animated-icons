import { createGroupTransformRecipe } from "./group-transform";

export const cogRecipe = createGroupTransformRecipe(
  { rotate: 180 },
  { type: "spring", stiffness: 50, damping: 10 },
);
