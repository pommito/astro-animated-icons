import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const sunRecipe = createStaggeredRevealRecipe(
  Array.from({ length: 8 }, (_, index) => ({
    child: index + 2,
    delay: (index + 1) * 0.1,
    opacityOnly: true,
  })),
);
