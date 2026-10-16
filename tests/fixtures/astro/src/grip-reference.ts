import { grips } from "../../../helpers/grips";

const references = new Map<Element, Animation[]>();
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

function resetReference(control: Element) {
  references.get(control)?.forEach((animation) => animation.cancel());
  references.delete(control);
}

function playReference(control: Element, returning = false) {
  if (returning && !references.has(control)) return;
  const icon = grips.find((icon) => icon.slug === (control as HTMLElement).dataset.icon)!;
  const circles = [...control.querySelectorAll("circle")];
  const poses = circles.map((circle) => {
    const style = getComputedStyle(circle);
    return { opacity: Number(style.opacity), scale: new DOMMatrix(style.transform).a };
  });
  resetReference(control);
  if (reducedMotion.matches) return;
  const animations = circles.flatMap((circle, index) => {
    const options: KeyframeAnimationOptions = returning
      ? { duration: 250, easing: "ease-out", fill: "both" }
      : { delay: icon.delays[index], duration: icon.pulse ? 1000 : 1100, fill: "both" };
    const opacity = returning ? [poses[index].opacity, 1] : icon.pulse ? [1, 0.4, 1] : [1, 0.3, 0.3, 1];
    const offset = returning ? [0, 1] : icon.pulse ? [0, 0.5, 1] : [0, 0.2, 0.8, 1];
    const easing = returning ? "linear" : icon.pulse ? "ease-in-out" : "ease-out";
    const tracks = [circle.animate({ opacity, offset, easing }, options)];
    if (icon.pulse) {
      const transform = returning ? [`scale(${poses[index].scale})`, "scale(1)"] : ["scale(1)", "scale(0.85)", "scale(1)"];
      tracks.push(circle.animate({ transform, offset, easing }, options));
    }
    return tracks;
  });
  references.set(control, animations);
  void Promise.all(animations.map((animation) => animation.finished)).then(() => {
    if (references.get(control) === animations) resetReference(control);
  }).catch(() => {});
}

for (const control of document.querySelectorAll("[data-reference]")) {
  control.addEventListener("pointerenter", (event) => {
    if ((event as PointerEvent).pointerType !== "touch") playReference(control);
  });
  control.addEventListener("pointerleave", () => playReference(control, true));
}

document.querySelector("#play")!.addEventListener("click", () => {
  for (const { tag } of grips) document.querySelectorAll(tag).forEach((icon) => icon.startAnimation());
  document.querySelectorAll("[data-reference]").forEach((control) => playReference(control));
});
document.querySelector("#stop")!.addEventListener("click", () => {
  for (const { tag } of grips) document.querySelectorAll(tag).forEach((icon) => icon.stopAnimation());
  document.querySelectorAll("[data-reference]").forEach((control) => playReference(control, true));
});
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) document.querySelectorAll("[data-reference]").forEach(resetReference);
});
window.addEventListener("pagehide", () => document.querySelectorAll("[data-reference]").forEach(resetReference));
