import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const workflowRecipe = createStaggeredRevealRecipe([
  { child: 1, delay: 0, opacityDelay: 0.15, preservePose: true },
  { child: 2, delay: 0.3, opacityDelay: 0.15, preservePose: true },
  { child: 3, delay: 0, opacityDelay: 0.15, preservePose: true },
]);
