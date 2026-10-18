import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const keyRecipe = createSvgKeyframesRecipe(
  { rotate: [-3, -33, -25, -28] },
  { duration: 0.6, times: [0, 0.6, 0.8, 1], ease: "easeInOut" },
  "30% 70%", { type: "spring", stiffness: 120, damping: 14 },
);
