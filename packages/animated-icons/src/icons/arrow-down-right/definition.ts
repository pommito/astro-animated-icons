import { createDirectionalPulseRecipe } from "../../shared/directional-pulse";

export const arrowDownRightPaths = ["M7 7 L17 17", "M17 7v10H7", "M17 17 L10 17"];
export const arrowDownRightOrigins: Record<number, string> = {
  0: "transform-box: view-box; transform-origin: 17px 17px",
};

export const arrowDownRightRecipe = createDirectionalPulseRecipe([
  { x: [0, -3, 0], y: [0, -3, 0], scale: [1, 0.85, 1] },
  { x: [0, -3, 0], y: [0, -3, 0] },
  { x: [0, -3, 0], y: [0, -3, 0] },
], 0.5, "easeInOut");
