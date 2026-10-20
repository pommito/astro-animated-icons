import { createDirectionalPulseRecipe } from "../../shared/directional-pulse";

export const arrowBigUpDashPaths = ["M9 19h6", "M9 15v-3H5l7-7 7 7h-4v3H9z"];

export const arrowBigUpDashRecipe = createDirectionalPulseRecipe([
  { y: [0, -1, 0] },
  { y: [0, -3, 0] },
], 0.4, "easeOut");
