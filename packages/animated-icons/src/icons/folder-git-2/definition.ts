import { createStaggeredRevealRecipe } from "../../shared/staggered-reveal";

export const folderGit2Recipe = createStaggeredRevealRecipe([
  { child: 2, delay: 0.1 },
  { child: 3, delay: 0.4, reverseOffset: true },
  { child: 4, delay: 0.7 },
]);
