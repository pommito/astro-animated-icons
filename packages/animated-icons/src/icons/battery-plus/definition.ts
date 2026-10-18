import { createPulseRecipe } from "../../shared/pulse";

export const batteryPlusRecipe = createPulseRecipe({
  scale: [1, 0.8, 1.2, 1],
  opacity: [1, 0.5, 1],
  duration: 0.5,
  repeat: 0,
});
