import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const cartRecipe = createSvgKeyframesRecipe(
  { scale: 1.1, y: [0, -5, 0] },
  { duration: 0.3, ease: "easeInOut" },
  "50% 50%",
  { duration: 0.2, ease: "easeOut" },
  { y: { continueOnReturn: true } },
  { y: { repeat: 1, delay: 0.1, duration: 0.4, ease: "easeOut" } },
);
