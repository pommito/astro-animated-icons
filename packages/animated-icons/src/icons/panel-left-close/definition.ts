import { createGroupTransformRecipe } from "../../shared/group-transform";

export const panelLeftCloseRecipe = createGroupTransformRecipe(
  { x: [null, -1.5, 0] }, { duration: 0.5, times: [0, 0.4, 1], ease: "easeOut" },
);
