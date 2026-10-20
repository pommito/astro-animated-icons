import { createDirectionalPulseRecipe } from "../../shared/directional-pulse";

export const arrowBigLeftPaths = ["M18 15h-6v4l-7-7 7-7v4h6v6z"];

export const arrowBigLeftRecipe = createDirectionalPulseRecipe([
  { x: [0, -3, 0] },
], 0.4, "easeOut");
