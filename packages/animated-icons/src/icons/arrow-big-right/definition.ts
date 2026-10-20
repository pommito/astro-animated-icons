import { createDirectionalPulseRecipe } from "../../shared/directional-pulse";

export const arrowBigRightPaths = ["M6 9h6V5l7 7-7 7v-4H6V9z"];

export const arrowBigRightRecipe = createDirectionalPulseRecipe([
  { x: [0, 3, 0] },
], 0.4, "easeOut");
