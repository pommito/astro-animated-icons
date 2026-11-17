import type { TransformCycle } from "./finite-transform-cycle";

export function transformCSS(cycle: TransformCycle, frames: string, back: string, easing: string, returnEasing: string) {
  const name = "grave-cycle-" + cycle.id;
  const target = '[data-css-cycle="' + cycle.id + '"]';
  const selector = target + (cycle.target === "svg" ? " > svg" : " " + cycle.target);
  return "@keyframes " + name + "-entry{" + frames + "}" +
    "@keyframes " + name + "-return{" + back + "}" +
    "@media(prefers-reduced-motion:no-preference){" +
    selector + "{animation-duration:" + cycle.duration + "s;animation-timing-function:" + easing + ";animation-fill-mode:both;" +
    "}" +
    selector.replace(target, target + '[data-cycle-state="entry"]') + "{animation-name:" + name + "-entry;}" +
    selector.replace(target, target + '[data-cycle-state="return"]') + "{animation-name:" + name + "-return;animation-duration:" + (cycle.returnDuration ?? cycle.duration) + "s;animation-timing-function:" + returnEasing + ";}" + "}";
}
