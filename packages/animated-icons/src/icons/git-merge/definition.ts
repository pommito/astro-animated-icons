import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const gitMergeRecipe = createStaggeredRevealRecipe([
  { child: 1, delay: 0.1 },
  { child: 2, delay: 0.7 },
  { child: 3, delay: 0.4, reverseOffset: true },
]);
