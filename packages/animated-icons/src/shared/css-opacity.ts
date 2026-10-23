import type { IconRecipe } from "../element";
import type { OpacityPart } from "./opacity-parts";
import { ensureOpacityCSS } from "./opacity-css";

export function createCSSOpacityRecipe(id: string, parts: OpacityPart[]): IconRecipe {
  const playbacks = new WeakMap<SVGElement, { active: boolean; animation?: Animation }>();
  const elements = (drawing: SVGGElement) => parts.map(part => drawing.querySelector<SVGElement>(part.selector)!);
  return {
    finish: "hold",
    connect(host) { ensureOpacityCSS(id, parts, host.ownerDocument); },
    animate(drawing, returning, track) {
      const host = drawing.closest<HTMLElement>("[data-css-opacity]")!;
      ensureOpacityCSS(id, parts, host.ownerDocument);
      const targets = elements(drawing);
      const from = targets.map(target => getComputedStyle(target).opacity);
      host.removeAttribute("data-opacity-state");
      targets.forEach((target, index) => {
        target.style.removeProperty("opacity");
        target.style.setProperty("--grave-opacity-from", from[index]);
        const previous = playbacks.get(target);
        const interrupted = previous?.active && previous.animation?.playState !== "finished";
        target.style.setProperty("--grave-opacity-entry-from", interrupted ? from[index] : String(parts[index].variants.animate.opacity[0]));
      });
      // Flush the removed animation names before replaying the same names.
      targets.forEach(target => getComputedStyle(target).animationName);
      host.setAttribute("data-opacity-state", returning ? "return" : "entry");
      targets.forEach((target, index) => track(onComplete => {
        const name = "grave-opacity-" + id + "-" + index + (returning ? "-return" : "-entry");
        const animation = target.getAnimations().find(animation => "animationName" in animation && animation.animationName === name);
        const playback = { active: true, animation };
        playbacks.set(target, playback);
        const finish = () => { playback.active = false; onComplete(); };
        if (animation) animation.onfinish = finish;
        else queueMicrotask(finish);
        return {
          stop() {
            if (animation?.playState === "finished") playback.active = false;
            target.style.opacity = getComputedStyle(target).opacity;
          },
          cancel() { animation?.cancel(); },
        };
      }));
    },
    clear(drawing) {
      drawing.closest<HTMLElement>("[data-css-opacity]")!.removeAttribute("data-opacity-state");
      for (const target of elements(drawing)) {
        playbacks.delete(target);
        for (const property of ["opacity", "--grave-opacity-from", "--grave-opacity-entry-from"]) target.style.removeProperty(property);
      }
    },
  };
}
