import { ensureCycleCSS } from "./cycle-css";
import type { IconRecipe } from "../element";
import type { FiniteTransformCycle } from "./finite-transform-cycle";

export function createCSSCycleRecipe(cycle: FiniteTransformCycle): IconRecipe {
  const targetFor = (drawing: SVGGElement) => cycle.target === "svg"
    ? drawing.ownerSVGElement! : drawing.querySelector<SVGElement>(cycle.target)!;
  return {
    finish: cycle.finish,
    connect(host) { ensureCycleCSS(cycle, host.ownerDocument); },
    animate(drawing, returning, track) {
      const host = drawing.closest<HTMLElement>("[data-css-cycle]")!;
      ensureCycleCSS(cycle, host.ownerDocument);
      const target = targetFor(drawing);
      const from = getComputedStyle(target).transform;
      if (cycle.origin) target.style.transformOrigin = cycle.origin;
      host.removeAttribute("data-cycle-state");
      target.style.removeProperty("transform");
      host.style.setProperty("--grave-cycle-from", from);
      // A style flush makes repeated entry and return names start a new CSS animation.
      getComputedStyle(target).animationName;
      host.setAttribute("data-cycle-state", returning ? "return" : "entry");
      track(onComplete => {
        const name = "grave-cycle-" + cycle.id + (returning ? "-return" : "-entry");
        const animation = target.getAnimations().find(animation =>
          "animationName" in animation && animation.animationName === name,
        );
        if (animation) animation.onfinish = onComplete;
        else queueMicrotask(onComplete);
        return {
          stop() { target.style.transform = getComputedStyle(target).transform; },
          cancel() {
            animation?.cancel();
            host.removeAttribute("data-cycle-state");
          },
        };
      });
    },
    clear(drawing) {
      const host = drawing.closest<HTMLElement>("[data-css-cycle]")!;
      host.removeAttribute("data-cycle-state");
      host.style.removeProperty("--grave-cycle-from");
      const target = targetFor(drawing);
      target.style.removeProperty("transform");
      if (cycle.origin) target.style.removeProperty("transform-origin");
    },
  };
}
