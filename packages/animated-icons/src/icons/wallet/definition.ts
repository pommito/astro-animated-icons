import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const walletRecipe = createSvgKeyframesRecipe(
  { y: [0, -3, 0], rotate: [0, -4, 0] },
  { duration: 0.55, ease: "easeInOut", times: [0, 0.45, 1] },
  "12px 12px",
  { duration: 0.3, ease: "easeOut" },
);
