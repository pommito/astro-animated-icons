import { createDirectionalPulseRecipe } from "../../shared/directional-pulse";

export const arrowBigDownPaths = ["M15 6v6h4l-7 7-7-7h4V6h6z"];

export const arrowBigDownRecipe = createDirectionalPulseRecipe([
  { y: [0, 3, 0] },
], 0.4, "easeOut");
