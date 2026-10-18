import { createPathRevealRecipe } from "../../shared/path-reveal";

export const bluetoothRecipe = createPathRevealRecipe([
  { duration: 0.3, ease: "easeInOut", opacityDuration: 0.3, pathOffset: 1 },
  { duration: 0.3, ease: "easeInOut", opacityDuration: 0.3, pathOffset: 1 },
]);
