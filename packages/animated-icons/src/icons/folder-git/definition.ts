import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const folderGitRecipe = createStaggeredRevealRecipe([
  { child: 2, delay: 0.15, defaultEase: true, opacityDelay: 0.1 },
  { child: 3, delay: 0.3, defaultEase: true, opacityDelay: 0.2 },
  { child: 4, delay: 0, defaultEase: true, opacityDelay: 0 },
]);
