import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const fanRecipe = createSvgKeyframesRecipe(
  { rotate: 270 },
  { delay: 0.1, type: "spring", stiffness: 80, damping: 13 },
  "50% 50%",
  { type: "spring", stiffness: 60, damping: 10, duration: 0.5 },
);
