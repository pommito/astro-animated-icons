import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const gitCompareArrowsRecipe = createStaggeredRevealRecipe([
  { child: 1, delay: 0.1 },
  { child: 2, delay: 0.4, reverseOffset: true },
  { child: 3, delay: 0.4, opacityOnly: true, returnDelay: 0.4 },
  { child: 4, delay: 0.7 },
  { child: 5, delay: 0.4, reverseOffset: true },
  { child: 6, delay: 0.4, opacityOnly: true, returnDelay: 0.4 },
]);
