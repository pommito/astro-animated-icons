import { createPulseRecipe } from "../../shared/pulse";

export const batteryWarningRecipe = createPulseRecipe({
  scale: [1, 1.1, 1],
  opacity: [1, 0.4, 1],
  duration: 0.8,
  repeat: Infinity,
});
