import { createSvgPartsRecipe } from "./svg-parts";

export function createGlyphSwapRecipe() {
  return createSvgPartsRecipe([1, -1].map(direction => ({
    selector: `[data-part="glyph-${direction}"]`,
    variants: { normal: { y: 0 }, animate: { y: direction * 10 } },
    transition: { type: "spring", stiffness: 240, damping: 24 },
  })));
}
