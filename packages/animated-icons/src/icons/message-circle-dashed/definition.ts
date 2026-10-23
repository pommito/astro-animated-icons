import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const messageCircleDashedRecipe = createStaggeredRevealRecipe(Array.from({ length: 8 }, (_, index) => ({
  child: index + 1,
  delay: (index + 1) * 0.1,
  opacityOnly: true,
  opacityEase: "easeOut",
  preservePose: true,
})));
