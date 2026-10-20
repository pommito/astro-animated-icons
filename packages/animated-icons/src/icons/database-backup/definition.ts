import { createGroupTransformRecipe } from "../../shared/group-transform";

export const databaseBackupRecipe = createGroupTransformRecipe({ rotate: 360 }, { duration: 0.6, ease: "easeInOut" });
