import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const keyCircleRecipe = createSvgKeyframesRecipe(
  { y: [0, -3, 0, -2, 0], rotate: [0, 3, -3, 0] },
  { duration: 0.9, ease: "easeOut" },
);
