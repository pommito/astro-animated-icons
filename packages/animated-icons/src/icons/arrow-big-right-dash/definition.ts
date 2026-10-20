import { createDirectionalPulseRecipe } from "../../shared/directional-pulse";

export const arrowBigRightDashPaths = ["M5 9v6", "M9 9h3V5l7 7-7 7v-4H9V9z"];

export const arrowBigRightDashRecipe = createDirectionalPulseRecipe([
  { x: [0, 1, 0] },
  { x: [0, 3, 0] },
], 0.4, "easeOut");
