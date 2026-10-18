import { createGroupTransformRecipe } from "../../shared/group-transform";

export const cloudDownloadRecipe = createGroupTransformRecipe(
  { y: 2 },
  { duration: 0.3, ease: [0.68, -0.6, 0.32, 1.6] },
);
