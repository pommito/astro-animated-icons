import type { FiniteTransformCycle, TransformCycle } from "./finite-transform-cycle";
import { combinedKeyframes } from "./combined-transform-css";
import { ensureRecipeCSS } from "./recipe-css";

export function cycleCSS(cycle: TransformCycle) {
  const combined = "tracks" in cycle;
  const transform = (value: number) => !combined ? cycle.property + "(" + value + (cycle.property === "rotate" ? "deg" : "px") + ")" : "";
  const frames = combined ? combinedKeyframes(cycle, false) : cycle.values.map((value, index) => cycle.times[index] * 100 + "%{transform:" +
    (index === 0 && cycle.replay === "current" ? "var(--grave-cycle-from," + transform(value) + ")" : transform(value)) + ";}").join("");
  const name = "grave-cycle-" + cycle.id;
  const target = '[data-css-cycle="' + cycle.id + '"]';
  const selector = target + (cycle.target === "svg" ? " > svg" : " " + cycle.target);
  const easingFor = (ease: FiniteTransformCycle["ease"]) => ease === "easeInOut" ? "cubic-bezier(.42,0,.58,1)" : "cubic-bezier(0,0,.58,1)";
  const easing = combined ? "linear" : easingFor(cycle.ease);
  const back = combined ? combinedKeyframes(cycle, true) : "from{transform:var(--grave-cycle-from);}to{transform:" + transform(0) + ";}";
  return "@keyframes " + name + "-entry{" + frames + "}" +
    "@keyframes " + name + "-return{" + back + "}" +
    "@media(prefers-reduced-motion:no-preference){" +
    selector + "{animation-duration:" + cycle.duration + "s;animation-timing-function:" + easing + ";animation-fill-mode:both;" +
    "}" +
    selector.replace(target, target + '[data-cycle-state="entry"]') + "{animation-name:" + name + "-entry;}" +
    selector.replace(target, target + '[data-cycle-state="return"]') + "{animation-name:" + name + "-return;animation-duration:" + (cycle.returnDuration ?? cycle.duration) + "s;animation-timing-function:" + (combined ? "linear" : easingFor(cycle.returnEase ?? cycle.ease)) + ";}" + "}";
}

export function ensureCycleCSS(cycle: TransformCycle, document: Document) {
  ensureRecipeCSS(cycle.id, document, () => cycleCSS(cycle));
}
