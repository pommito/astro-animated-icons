import { createStaggeredCycleRecipe } from "../../shared/staggered-cycle";

export const chartBarDecreasingRecipe = createStaggeredCycleRecipe([
  { child: 2, hideDelay: 0.1, revealDelay: 0.1 },
  { child: 3, hideDelay: 0.2, revealDelay: 0.2 },
  { child: 4, hideDelay: 0, revealDelay: 0 },
]);
