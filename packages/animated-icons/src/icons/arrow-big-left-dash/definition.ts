import { createDirectionalPulseRecipe } from "../../shared/directional-pulse";

export const arrowBigLeftDashPaths = ["M19 15V9", "M15 15h-3v4l-7-7 7-7v4h3v6z"];

export const arrowBigLeftDashRecipe = createDirectionalPulseRecipe([
  { x: [0, -1, 0] },
  { x: [0, -3, 0] },
], 0.4, "easeOut");
