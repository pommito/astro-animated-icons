import { createPulseRecipe } from "../../shared/pulse";

export const batteryChargingRecipe = createPulseRecipe({
  scale: [1, 1.2, 1],
  opacity: [1, 0.8, 1],
  duration: 0.8,
  repeat: Infinity,
});
