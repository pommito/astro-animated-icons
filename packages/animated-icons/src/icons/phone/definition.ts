import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const phoneRecipe = createSvgKeyframesRecipe(
  { rotate: [10, 20, -10, 10, 0], scale: [1, 1.1, 1] },
  { duration: 0.9, ease: "easeInOut" },
  "50% 50%",
  { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  { scale: { type: "spring", stiffness: 550, damping: 30 } },
);
