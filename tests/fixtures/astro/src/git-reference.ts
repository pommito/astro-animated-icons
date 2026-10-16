import { gitIcons } from "../../../helpers/git-icons";
import type { GithubIconHandle as IconHandle } from "@grave/animated-icons/astro";

interface ReferenceStep {
  child: number;
  delay: number;
  mode: string;
  opacityDelay?: number;
}

const references = new Map<Element, Animation[]>();
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const defaultEase = "cubic-bezier(0.25, 0.1, 0.35, 1)";

function resetReference(control: Element) {
  references.get(control)?.forEach((animation) => animation.cancel());
  references.delete(control);
}

function playReference(control: Element, returning = false) {
  if (returning && !references.has(control)) return;
  const icon = gitIcons.find((icon) => icon.slug === control.getAttribute("data-icon"))!;
  const shapes = [...control.querySelectorAll<SVGGeometryElement>("path, circle, line")];
  const origins = shapes.map((shape) => {
    const style = getComputedStyle(shape);
    return { opacity: style.opacity, dash: style.strokeDasharray, offset: style.strokeDashoffset, transform: style.transform };
  });
  resetReference(control);
  if (reducedMotion.matches) return;
  const animations: Animation[] = [];
  const add = (child: number, property: string, from: string | number, to: string | number, duration: number, delay: number, easing: string) => {
    animations.push(shapes[child - 1].animate([{ [property]: from }, { [property]: to }], { duration, delay, easing, fill: "both" }));
  };
  if (icon.slug === "github") {
    add(1, "opacity", returning ? origins[0].opacity : 0, 1, returning ? 300 : 400, 0, "ease-out");
    add(1, "strokeDasharray", returning ? origins[0].dash : "0 1", "1 1", returning ? 300 : 400, 0, "ease-out");
    add(1, "transform", returning ? origins[0].transform : "scale(0.9)", "scale(1)", returning ? 300 : 400, 0, "ease-out");
    add(2, "strokeDasharray", returning ? origins[1].dash : "0 1", "1 1", returning ? 300 : 500, 0, "ease-out");
    add(2, "transform", origins[1].transform, "rotate(0deg)", returning ? 300 : 500, 0, "ease-out");
    if (!returning) animations.push(shapes[1].animate(
      [0, -15, 15, -10, 10, -5, 5].map((angle) => ({ transform: `rotate(${angle}deg)`, easing: "ease-in-out" })),
      { duration: 2500, delay: 500, iterations: Infinity, fill: "forwards" },
    ));
  } else {
    const steps: readonly ReferenceStep[] = icon.steps;
    for (const { child, delay, mode, opacityDelay } of steps) {
      const origin = origins[child - 1];
      const returnDelay = mode === "fade-delayed-return" ? 400 : 0;
      add(child, "opacity", returning ? origin.opacity : 0, 1, 300, returning ? returnDelay : (opacityDelay ?? delay) * 1000, defaultEase);
      if (mode.startsWith("fade")) continue;
      const duration = returning ? 300 : mode === "long" ? 700 : 300;
      const pathDelay = returning ? 0 : delay * 1000;
      const ease = returning || mode === "default" ? defaultEase : "ease-out";
      add(child, "strokeDasharray", returning ? origin.dash : "0 1", "1 1", duration, pathDelay, ease);
      if (mode === "reverse") add(child, "strokeDashoffset", returning ? origin.offset : -1, 0, duration, pathDelay, ease);
    }
  }
  references.set(control, animations);
  if (returning) {
    void Promise.all(animations.map((animation) => animation.finished)).then(() => {
      if (references.get(control) === animations) resetReference(control);
    }).catch(() => {});
  }
}

for (const control of document.querySelectorAll("[data-reference]")) {
  control.addEventListener("pointerenter", (event) => {
    if ((event as PointerEvent).pointerType !== "touch") playReference(control);
  });
  control.addEventListener("pointerleave", () => playReference(control, true));
}
for (const [id, returning] of [["play", false], ["stop", true]] as const) {
  document.querySelector(`#${id}`)!.addEventListener("click", () => {
    document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach((icon) => returning ? icon.stopAnimation() : icon.startAnimation());
    document.querySelectorAll("[data-reference]").forEach((control) => playReference(control, returning));
  });
}
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) document.querySelectorAll("[data-reference]").forEach(resetReference);
});
window.addEventListener("pagehide", () => document.querySelectorAll("[data-reference]").forEach(resetReference));
