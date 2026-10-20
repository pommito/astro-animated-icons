import { createGroupTransformRecipe } from "../../shared/group-transform";

export const serverCogRecipe = createGroupTransformRecipe({ rotate: 180 }, { type: "spring", stiffness: 50, damping: 10 });
