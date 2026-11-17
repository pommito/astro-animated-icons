import type { FiniteTransformCycle } from "./finite-transform-cycle";
import { ensureRecipeCSS } from "./recipe-css";
import { transformCSS } from "./transform-css";

export function cycleCSS(cycle: FiniteTransformCycle) {
  const transform = (value: number) => cycle.property + "(" + value + (cycle.property === "rotate" ? "deg" : "px") + ")";
  const frames = cycle.values.map((value, index) => cycle.times[index] * 100 + "%{transform:" +
    (index === 0 && cycle.replay === "current" ? "var(--grave-cycle-from," + transform(value) + ")" : transform(value)) + ";}").join("");
  const back = "from{transform:var(--grave-cycle-from);}to{transform:" + transform(0) + ";}";
  const easing = (ease: FiniteTransformCycle["ease"]) => ease === "easeInOut" ? "cubic-bezier(.42,0,.58,1)" : "cubic-bezier(0,0,.58,1)";
  return transformCSS(cycle, frames, back, easing(cycle.ease), easing(cycle.returnEase ?? cycle.ease));
}

export function ensureCycleCSS(cycle: FiniteTransformCycle, document: Document) {
  ensureRecipeCSS(cycle.id, document, () => cycleCSS(cycle));
}
