import { createPathRevealRecipe } from "../../shared/path-reveal";

export const italicRecipe = createPathRevealRecipe([
  { duration: 0.2, delay: 0, ease: "easeOut", pathOffset: 1, opacityDuration: 0.2 },
  { duration: 0.2, delay: 0, ease: "easeOut", pathOffset: 1, opacityDuration: 0.2 },
  { duration: 0.4, delay: 0.1, ease: "easeOut", pathOffset: 1 },
]);
