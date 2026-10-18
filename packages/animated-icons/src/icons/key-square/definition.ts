import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const keySquareRecipe = createSvgKeyframesRecipe(
  { rotate: [0, 15, -15, 0], scale: [1, 1.05, 1, 1] },
  { duration: 0.6, ease: "easeOut" },
);
