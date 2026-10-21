import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const refreshCwOffRecipe = createSvgKeyframesRecipe(
  { x: [-3, 3, -3, 3, 0] },
  { duration: 0.4, ease: "easeOut" },
  "50% 50%",
  { type: "spring", stiffness: 500, damping: 20 },
);
