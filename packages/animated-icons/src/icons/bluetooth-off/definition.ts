import { createPathRevealRecipe } from "../../shared/path-reveal";

export const bluetoothOffRecipe = createPathRevealRecipe([
  { duration: 0.3, ease: "easeOut", opacityDuration: 0.3, pathOffset: 1 },
  { duration: 0.2, delay: 0.3, ease: "easeOut", opacityDuration: 0.2 },
  { duration: 0.3, ease: "easeOut", opacityDuration: 0.3, pathOffset: 1 },
]);
