import { createPathRevealRecipe } from "../../shared/path-reveal";

export const underlineRecipe = createPathRevealRecipe([
  { duration: 0.3, delay: 0, ease: "easeOut", pathOffset: 1, opacityDuration: 0.3 },
  { duration: 0.4, delay: 0.2, ease: "easeOut", pathOffset: 1, opacityDuration: 0.4 },
]);
