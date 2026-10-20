import { createPlaneFlightRecipe } from "../../shared/plane-flight";

export const planeLandingRecipe = createPlaneFlightRecipe({
  x: [-38, 1, 0], y: [-20, 1, 0], scale: [0.5, 1], rotate: [16, -5, 0],
}, [0, 0.65, 1]);
