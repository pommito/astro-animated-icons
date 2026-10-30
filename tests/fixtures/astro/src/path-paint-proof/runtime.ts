import type { IconRecipe } from "../../../../../packages/animated-icons/src/element";
import { ensureRecipeCSS } from "../../../../../packages/animated-icons/src/shared/recipe-css";
import { paintCSS, measureTargets, trackName, cssProperty } from "./compiler.mjs";
export interface PaintProofPlan {
  id: string;
  finish: "hold" | "restore";
  replay: string;
  entry: PaintChannel[];
  returning: PaintChannel[];
}
interface PaintChannel {
  target: number;
  property: string;
  values: (number | number[] | null)[];
  offsets: number[];
  intervalEase: string[];
  duration: number;
  delay: number;
  ease: string;
}

export function createPaintProof(plan: PaintProofPlan): IconRecipe {
  const states = new WeakMap<SVGElement, { active: boolean }>();
  const channels = [...plan.entry, ...plan.returning];
  const targets = [...new Set(channels.map(channel => channel.target))];
  const ensure = (document: Document) => ensureRecipeCSS("proof-paint-" + plan.id, document, () => paintCSS(plan));
  return {
    finish: plan.finish as "hold" | "restore",
    connect(host) { ensure(host.ownerDocument); },
    animate(drawing, returning, track) {
      const host = drawing.parentElement!.closest<HTMLElement>("[data-pp-id]")!;
      ensure(host.ownerDocument);
      const lengths = measureTargets(plan, drawing);
      const phase = returning ? plan.returning : plan.entry;
      const captured = new Map(targets.map(index => {
        const shape = drawing.children[index - 1] as SVGElement;
        const style = getComputedStyle(shape);
        const length = lengths.get(index);
        const active = states.get(shape)?.active;
        return [index, { shape, length, style: { opacity: style.opacity, strokeDasharray: style.strokeDasharray, strokeDashoffset: style.strokeDashoffset },
          resume: plan.replay === "current" || plan.replay === "until-clear" && active || plan.replay === "active" && active || plan.replay === "dash-incomplete" && parseFloat(style.strokeDasharray) / length < 1 }];
      }));
      host.removeAttribute("data-pp-state");
      for (const index of targets) {
        const { shape, length } = captured.get(index)!;
        if (length !== undefined) shape.style.setProperty("--pp-length", length + "px");
      }
      phase.forEach((channel, index) => {
        const capture = captured.get(channel.target)!;
        const property = channel.property as keyof typeof capture.style;
        const first = channel.values[0];
        const resume = returning || capture.resume;
        let value = resume ? capture.style[property] : channel.property === "opacity" ? String(first)
          : (first as number[]).map(coefficient => coefficient * capture.length + "px").join(" ");
        if (value === "none" && plan.id === "receipt-text") value = `${capture.length}px ${capture.length}px`;
        capture.shape.style.setProperty("--pp-from-" + index, value);
        capture.shape.style.removeProperty(cssProperty(channel.property));
      });
      targets.forEach(index => getComputedStyle(captured.get(index)!.shape).animationName);
      host.setAttribute("data-pp-state", returning ? "return" : "entry");
      const playbacks = new Map(targets.map(index => {
        const playback = { active: true };
        states.set(captured.get(index)!.shape, playback);
        return [index, playback];
      }));
      phase.forEach((channel, index) => track(onComplete => {
        const { shape } = captured.get(channel.target)!;
        const name = trackName(plan.id, returning, index);
        const animation = shape.getAnimations().find(animation => "animationName" in animation && animation.animationName === name);
        animation?.effect?.updateTiming({ easing: channel.ease });
        let cancelled = false;
        const commit = () => shape.style.setProperty(cssProperty(channel.property), getComputedStyle(shape).getPropertyValue(cssProperty(channel.property)));
        const primary = phase.some(other => other.target === channel.target && other.property === "strokeDasharray") ? "strokeDasharray" : "opacity";
        const finish = () => {
          if (cancelled) return;
          if (channel.property === primary && plan.replay !== "until-clear") playbacks.get(channel.target)!.active = false;
          commit();
          animation?.cancel();
          onComplete();
        };
        if (animation) animation.onfinish = finish;
        else queueMicrotask(finish);
        return { stop() {
          if (animation?.playState === "finished" && channel.property === primary && plan.replay !== "until-clear") playbacks.get(channel.target)!.active = false;
          commit();
        }, cancel() { cancelled = true; animation?.cancel(); } };
      }));
    },
    clear(drawing) {
      drawing.closest("[data-pp-id]")!.removeAttribute("data-pp-state");
      for (const index of targets) {
        const shape = drawing.children[index - 1] as SVGElement;
        states.delete(shape);
        for (const property of [...shape.style]) if (property.startsWith("--pp-") || ["stroke-dasharray", "stroke-dashoffset", "opacity"].includes(property)) shape.style.removeProperty(property);
      }
    },
  };
}
