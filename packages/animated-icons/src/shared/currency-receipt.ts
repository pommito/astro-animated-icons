import type { IconRecipe } from "../element";
import { animatePathReveal, clearPathReveal } from "./path-reveal";

export function createCurrencyReceiptRecipe(main: number[], secondary: number[], reverseSecondary = false): IconRecipe {
  const strokes = [
    ...main.map((child) => ({ child, secondary: false })),
    ...secondary.map((child) => ({ child, secondary: true })),
  ];
  return {
    finish: "hold",
    animate(drawing, returning, track) {
      for (const stroke of strokes) {
        animatePathReveal(drawing.children[stroke.child - 1] as SVGGeometryElement, returning, track, {
          duration: stroke.secondary ? returning ? 0.3 : 0.4 : returning ? 0.4 : 0.6,
          delay: stroke.secondary ? returning ? 0.3 : 0.5 : 0,
          ease: "easeOut",
          opacityDuration: 0.1,
          reverseOffset: stroke.secondary && reverseSecondary,
        });
      }
    },
    clear(drawing) {
      for (const stroke of strokes) clearPathReveal(drawing.children[stroke.child - 1] as SVGGeometryElement);
    },
  };
}
