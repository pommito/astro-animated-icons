import type { IconRecipe } from "../element";
import type { TransformCycle } from "./finite-transform-cycle";

interface RetainedTransform {
  capture(host: HTMLElement, target: SVGElement, returning: boolean): { finish(): void; stop(time: number): void };
  clear(host: HTMLElement, target: SVGElement): void;
}

export function createTransformRecipe(cycle: TransformCycle, ensure: (document: Document) => void, retained?: RetainedTransform): IconRecipe {
  const targetFor = (drawing: SVGGElement) => cycle.target === "svg"
    ? drawing.ownerSVGElement! : drawing.querySelector<SVGElement>(cycle.target)!;
  return {
    finish: cycle.finish,
    connect(host) { ensure(host.ownerDocument); },
    animate(drawing, returning, track) {
      const host = drawing.closest<HTMLElement>("[data-css-cycle]")!;
      ensure(host.ownerDocument);
      const target = targetFor(drawing);
      const from = getComputedStyle(target).transform;
      const pose = retained?.capture(host, target, returning);
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
        let cancelled = false;
        const complete = () => {
          if (!cancelled) pose?.finish();
          onComplete();
        };
        if (animation) animation.onfinish = complete;
        else queueMicrotask(complete);
        return {
          stop() {
            pose?.stop(Number(animation?.currentTime ?? 0));
            target.style.transform = getComputedStyle(target).transform;
          },
          cancel() {
            cancelled = true;
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
      retained?.clear(host, target);
      target.style.removeProperty("transform");
      if (cycle.origin) target.style.removeProperty("transform-origin");
    },
  };
}
