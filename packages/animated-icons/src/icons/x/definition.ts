import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const xRecipe = createStaggeredRevealRecipe([
  { child: 1, delay: 0, defaultEase: true },
  { child: 2, delay: 0.2, returnDelay: 0.2, defaultEase: true },
]);
