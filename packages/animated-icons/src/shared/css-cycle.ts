import type { FiniteTransformCycle } from "./finite-transform-cycle";
import { ensureCycleCSS } from "./cycle-css";
import { createTransformRecipe } from "./css-transform";

export function createCSSCycleRecipe(cycle: FiniteTransformCycle) {
  return createTransformRecipe(cycle, document => ensureCycleCSS(cycle, document));
}
