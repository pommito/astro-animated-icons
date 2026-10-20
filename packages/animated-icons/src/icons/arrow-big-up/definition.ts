import { createDirectionalPulseRecipe } from "../../shared/directional-pulse";

export const arrowBigUpPaths = ["M9 18v-6H5l7-7 7 7h-4v6H9z"];

export const arrowBigUpRecipe = createDirectionalPulseRecipe([
  { y: [0, -3, 0] },
], 0.4, "easeOut");
