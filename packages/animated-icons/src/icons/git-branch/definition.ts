import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const gitBranchRecipe = createStaggeredRevealRecipe([
  { child: 1, delay: 0.1 },
  { child: 2, delay: 0.4, reverseOffset: true },
  { child: 3, delay: 0.7 },
  { child: 4, delay: 0.4, reverseOffset: true },
]);
