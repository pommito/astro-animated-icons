import { createSvgPartsRecipe } from "./svg-parts";

export function createSteamRecipe(delays: number[], firstPart = 0) {
  return createSvgPartsRecipe(delays.map((delay, index) => ({
    selector: `[data-part='${firstPart + index}']`,
    variants: {
      normal: { y: 0, opacity: 1 },
      animate: {
        y: -3, opacity: [0, 1, 0],
        transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut", delay },
      },
    },
  })));
}
