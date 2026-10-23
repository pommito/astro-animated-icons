import type { FiniteTransformCycle } from "./finite-transform-cycle";

export function cycleCSS(cycle: FiniteTransformCycle) {
  const transform = (value: number) => cycle.property + "(" + value + (cycle.property === "rotate" ? "deg" : "px") + ")";
  const frames = cycle.values.map((value, index) => cycle.times[index] * 100 + "%{transform:" +
    (index === 0 && cycle.replay === "current" ? "var(--grave-cycle-from," + transform(value) + ")" : transform(value)) + ";}").join("");
  const name = "grave-cycle-" + cycle.id;
  const target = '[data-css-cycle="' + cycle.id + '"]';
  const selector = target + (cycle.target === "svg" ? " > svg" : " " + cycle.target);
  const easingFor = (ease: FiniteTransformCycle["ease"]) => ease === "easeInOut" ? "cubic-bezier(.42,0,.58,1)" : "cubic-bezier(0,0,.58,1)";
  const easing = easingFor(cycle.ease);
  return "@keyframes " + name + "-entry{" + frames + "}" +
    "@keyframes " + name + "-return{from{transform:var(--grave-cycle-from);}to{transform:" + transform(0) + ";}}" +
    "@media(prefers-reduced-motion:no-preference){" +
    selector + "{animation-duration:" + cycle.duration + "s;animation-timing-function:" + easing + ";animation-fill-mode:both;" +
    "}" +
    selector.replace(target, target + '[data-cycle-state="entry"]') + "{animation-name:" + name + "-entry;}" +
    selector.replace(target, target + '[data-cycle-state="return"]') + "{animation-name:" + name + "-return;animation-duration:" + (cycle.returnDuration ?? cycle.duration) + "s;animation-timing-function:" + easingFor(cycle.returnEase ?? cycle.ease) + ";}" + "}";
}

export function ensureCycleCSS(cycle: FiniteTransformCycle, document: Document) {
  ensureRecipeCSS(cycle.id, document, () => cycleCSS(cycle));
}

export function ensureRecipeCSS(id: string, document: Document, generate: () => string) {
  const [active, ...duplicates] = document.querySelectorAll('style[data-grave-cycle-style="' + id + '"]');
  duplicates.forEach(sheet => sheet.remove());
  if (active) return;
  const sheet = document.createElement("style");
  sheet.setAttribute("data-grave-cycle-style", id);
  sheet.textContent = generate();
  document.head.append(sheet);
}
