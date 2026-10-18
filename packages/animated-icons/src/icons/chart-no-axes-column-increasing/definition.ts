import { createStaggeredCycleRecipe } from "../../shared/staggered-cycle";

export const chartNoAxesColumnIncreasingRecipe = createStaggeredCycleRecipe([
  { child: 2, hideDelay: 0.1, revealDelay: 0.1 },
  { child: 3, hideDelay: 0.2, revealDelay: 0.2 },
  { child: 1, hideDelay: 0, revealDelay: 0 },
]);
