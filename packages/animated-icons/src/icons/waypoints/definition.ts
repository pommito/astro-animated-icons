import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const waypointsRecipe = createStaggeredRevealRecipe([0, 1, 0, 2, 0, 3, 0].map((index, position) => ({
  child: position + 1, delay: index * 0.15, opacityDelay: index * 0.1, preservePose: true,
})));
