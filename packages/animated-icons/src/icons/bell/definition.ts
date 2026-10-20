import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const bellRecipe = createSvgKeyframesRecipe(
  { rotate: [0, -10, 10, -10, 0] }, { duration: 0.5, ease: "easeInOut" },
);
