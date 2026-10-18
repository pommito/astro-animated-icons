import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const chartSplineRecipe = createStaggeredRevealRecipe([
  { child: 2, delay: 0.15, opacityDelay: 0.1 },
]);
