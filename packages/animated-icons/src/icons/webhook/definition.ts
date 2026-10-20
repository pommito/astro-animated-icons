import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const webhookRecipe = createStaggeredRevealRecipe([
  { child: 1, delay: 0.1, opacityDelay: 0.15, preservePose: true },
  { child: 2, delay: 0.1, opacityDelay: 0.15, preservePose: true },
  { child: 3, delay: 0.1, opacityDelay: 0.15, preservePose: true },
]);
