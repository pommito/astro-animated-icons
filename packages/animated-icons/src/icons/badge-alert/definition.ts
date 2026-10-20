import { createSvgKeyframesRecipe } from "../../shared/svg-keyframes";

export const badgeAlertRecipe = createSvgKeyframesRecipe(
  { scale: [1, 1.1, 1.1, 1.1, 1], rotate: [0, -3, 3, -2, 2, 0] },
  { duration: 0.5, times: [0, 0.2, 0.4, 0.6, 1], ease: "easeInOut" },
  "50% 50%",
  { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  { scale: { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 } },
);
