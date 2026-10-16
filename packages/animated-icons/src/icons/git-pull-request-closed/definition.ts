import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const gitPullRequestClosedRecipe = createStaggeredRevealRecipe([
  { child: 1, delay: 0.1 },
  { child: 2, delay: 0.4, reverseOffset: true },
  { child: 3, delay: 0.7, opacityOnly: true },
  { child: 4, delay: 0.7, opacityOnly: true },
  { child: 5, delay: 1, reverseOffset: true },
  { child: 6, delay: 1.3 },
]);
