import { createGroupTransformRecipe } from "../../shared/group-transform";

export const blocksRecipe = createGroupTransformRecipe({ translateX: -4, y: 4 }, { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 });
