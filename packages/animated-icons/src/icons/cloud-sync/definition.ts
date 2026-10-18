import { createGroupTransformRecipe } from "../../shared/group-transform";

export const cloudSyncRecipe = createGroupTransformRecipe(
  { rotate: -360 },
  { duration: 1.2, ease: "easeInOut" },
);
