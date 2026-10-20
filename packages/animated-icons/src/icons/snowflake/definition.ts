import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const snowflakeRecipe = createSvgKeyframesRecipe(
  { rotate: [0, -5, 5, -5, 5, 0] },
  { duration: 0.4, times: [0, 0.2, 0.4, 0.6, 0.8, 1], ease: "easeOut" },
  "50% 50%",
  { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
);
