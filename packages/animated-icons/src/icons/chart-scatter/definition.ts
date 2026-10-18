import { createStaggeredCycleRecipe } from "../../shared/staggered-cycle";

export const chartScatterRecipe = createStaggeredCycleRecipe([
  { child: 1, hideDelay: 0, revealDelay: 0, opacityOnly: true },
  { child: 2, hideDelay: 0, revealDelay: 0.15, opacityOnly: true },
  { child: 3, hideDelay: 0, revealDelay: 0.3, opacityOnly: true },
  { child: 4, hideDelay: 0, revealDelay: 0.45, opacityOnly: true },
  { child: 5, hideDelay: 0, revealDelay: 0.6, opacityOnly: true },
], 0.2);
