import { createGripRecipe, gripWaveDelay } from "../../shared/grip";

export const gripVerticalRecipe = createGripRecipe({
  opacity: [1, 0.4, 1],
  scale: [1, 0.85, 1],
  duration: 1,
  times: [0, 0.5, 1],
  ease: "easeInOut",
  delay: gripWaveDelay,
});
