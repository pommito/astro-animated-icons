import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const gitGraphRecipe = createStaggeredRevealRecipe([
  { child: 1, delay: 0.1 },
  { child: 2, delay: 0.4, reverseOffset: true },
  { child: 3, delay: 0.7 },
  { child: 4, delay: 0.4, reverseOffset: true },
  { child: 5, delay: 0.7 },
  { child: 6, delay: 0.4, reverseOffset: true },
]);
