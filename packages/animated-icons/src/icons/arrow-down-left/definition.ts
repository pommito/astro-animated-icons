import { createDirectionalPulseRecipe } from "../../shared/directional-pulse";

export const arrowDownLeftPaths = ["M17 17H7V7", "M7 17 L12 12", "M17 7 L12 12"];
export const arrowDownLeftOrigins: Record<number, string> = {
  1: "transform-box: view-box; transform-origin: 12px 17px",
};

export const arrowDownLeftRecipe = createDirectionalPulseRecipe([
  { x: [0, 3, 0], y: [0, -3, 0] },
  { x: [0, 3, 0], y: [0, -3, 0], scale: [1, 0.85, 1] },
  null,
], 0.5, "easeInOut");
