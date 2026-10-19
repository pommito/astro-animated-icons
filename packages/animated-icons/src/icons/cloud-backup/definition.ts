import { createGroupTransformRecipe } from "../../shared/group-transform";

export const cloudBackupRecipe = createGroupTransformRecipe(
  { rotate: -360 },
  { duration: 0.8, ease: "easeInOut" },
);
