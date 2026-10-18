import { createGroupTransformRecipe } from "../../shared/group-transform";

export const folderSyncRecipe = createGroupTransformRecipe(
  { rotate: -360 },
  { ease: "easeInOut", duration: 1.2 },
);
