import { createDirectionalPulseRecipe } from "../../shared/directional-pulse";

export const arrowBigDownDashPaths = ["M15 5H9", "M15 9v3h4l-7 7-7-7h4V9z"];

export const arrowBigDownDashRecipe = createDirectionalPulseRecipe([
  { y: [0, 1, 0] },
  { y: [0, 3, 0] },
], 0.4, "easeOut");
