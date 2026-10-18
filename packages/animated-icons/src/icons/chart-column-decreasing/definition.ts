import { createStaggeredCycleRecipe } from "../../shared/staggered-cycle";

export const chartColumnDecreasingRecipe = createStaggeredCycleRecipe([
  { child: 1, hideDelay: 0.1, revealDelay: 0.1 },
  { child: 2, hideDelay: 0.2, revealDelay: 0.2 },
  { child: 4, hideDelay: 0, revealDelay: 0 },
]);
