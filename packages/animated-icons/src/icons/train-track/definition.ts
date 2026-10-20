import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const trainTrackRecipe = createStaggeredRevealRecipe([4, 3, 2, 1, 0].map((index, position) => ({
  child: position + 2, delay: index * 0.1, opacityDelay: 0.15, preservePose: true,
})));
