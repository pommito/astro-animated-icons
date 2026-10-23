import type { FiniteTransformCycle } from "./finite-transform-cycle";

export function cycleCSS(cycle: FiniteTransformCycle) {
  const transform = (value: number) => cycle.property + "(" + value + (cycle.property === "rotate" ? "deg" : "px") + ")";
  const frames = cycle.values.map((value, index) => cycle.times[index] * 100 + "%{transform:" +
    (index === 0 && cycle.replay === "current" ? "var(--grave-cycle-from," + transform(value) + ")" : transform(value)) + ";}").join("");
  const name = "grave-cycle-" + cycle.id;
  const target = '[data-css-cycle="' + cycle.id + '"]';
  const selector = target + (cycle.target === "svg" ? " > svg" : " " + cycle.target);
  const easing = cycle.ease === "easeInOut" ? "cubic-bezier(.42,0,.58,1)" : "cubic-bezier(0,0,.58,1)";
  return "@keyframes " + name + "-entry{" + frames + "}" +
    "@keyframes " + name + "-return{from{transform:var(--grave-cycle-from);}to{transform:" + transform(0) + ";}}" +
    "@media(prefers-reduced-motion:no-preference){" +
    selector + "{animation-duration:" + cycle.duration + "s;animation-timing-function:" + easing + ";animation-fill-mode:both;" +
    "}" +
    selector.replace(target, target + '[data-cycle-state="entry"]') + "{animation-name:" + name + "-entry;}" +
    selector.replace(target, target + '[data-cycle-state="return"]') + "{animation-name:" + name + "-return;}" + "}";
}
