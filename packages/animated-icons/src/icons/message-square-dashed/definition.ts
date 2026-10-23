import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const messageSquareDashedRecipe = createStaggeredRevealRecipe(Array.from({ length: 9 }, (_, index) => ({
  child: index + 1,
  delay: (index + 1) * 0.1,
  opacityOnly: true,
  opacityEase: "easeOut",
  preservePose: true,
})));
