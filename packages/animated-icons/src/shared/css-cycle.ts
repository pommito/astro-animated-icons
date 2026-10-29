import { ensureCycleCSS } from "./cycle-css";
import type { IconRecipe } from "../element";
import type { TransformCycle } from "./finite-transform-cycle";
import { combinedDuration, combinedFrames, combinedPose } from "./combined-transform-cycle";

export function createCSSCycleRecipe(cycle: TransformCycle): IconRecipe {
  const combined = "tracks" in cycle ? cycle : undefined;
  const poses = new WeakMap<SVGElement, { values: number[] }>();
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
      const pose = combined ? { values: poses.get(target)?.values ?? combined.tracks.map(track => track.rest) } : undefined;
      const frames = combined && pose ? combinedFrames(combined, returning, pose.values) : undefined;
      if (pose) poses.set(target, pose);
      combined?.tracks.forEach((channel, index) => host.style.setProperty("--grave-cycle-" + index,
        (pose!.values[index] - channel.rest) + (channel.property === "scale" ? "" : channel.property === "rotate" ? "deg" : "px")));
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
          if (!cancelled && pose && frames && poses.get(target) === pose) pose.values = frames.at(-1)!;
          onComplete();
        };
        if (animation) animation.onfinish = complete;
        else queueMicrotask(complete);
        return {
          stop() {
            if (combined && pose && frames && poses.get(target) === pose) {
              pose.values = combinedPose(frames, combinedDuration(combined, returning), Number(animation?.currentTime ?? 0));
            }
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
      poses.delete(target);
      combined?.tracks.forEach((_, index) => host.style.removeProperty("--grave-cycle-" + index));
      target.style.removeProperty("transform");
      if (cycle.origin) target.style.removeProperty("transform-origin");
    },
  };
}
