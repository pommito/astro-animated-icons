import type { CombinedTransformCycle } from "./combined-transform-cycle";
import { combinedKeyframes } from "./combined-transform-css";
import { transformCSS } from "./transform-css";
import { ensureRecipeCSS } from "./recipe-css";

export function combinedCycleCSS(cycle: CombinedTransformCycle) {
  return transformCSS(cycle, combinedKeyframes(cycle, false), combinedKeyframes(cycle, true), "linear", "linear");
}

export function ensureCombinedCycleCSS(cycle: CombinedTransformCycle, document: Document) {
  ensureRecipeCSS(cycle.id, document, () => combinedCycleCSS(cycle));
}
