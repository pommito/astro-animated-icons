import type { SunIconHandle as IconHandle } from "@grave/animated-icons/astro";

const references = new Map<Element, Animation[]>();
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const defaultEase = "cubic-bezier(0.25, 0.1, 0.35, 1)";

function resetReference(control: Element) {
  references.get(control)?.forEach((animation) => animation.cancel());
  references.delete(control);
}

function playReference(control: Element, returning = false) {
  if (returning && !references.has(control)) return;
  const drawing = control.querySelector("g")!;
  const shapes = [...drawing.querySelectorAll<SVGGeometryElement>("path, rect, circle, line")];
  const origins = shapes.map((shape) => {
    const style = getComputedStyle(shape);
    return { opacity: Number(style.opacity), dash: style.strokeDasharray, offset: parseFloat(style.strokeDashoffset) };
  });
  const rotation = getComputedStyle(drawing).transform;
  resetReference(control);
  if (reducedMotion.matches) return;
  const animations: Animation[] = [];
  const add = (element: Element, keyframes: PropertyIndexedKeyframes, duration: number, easing = defaultEase, delay = 0) => {
    animations.push(element.animate(keyframes, { duration, easing, delay, fill: "both" }));
  };
  switch (control.getAttribute("data-icon")) {
    case "sun":
      shapes.slice(1).forEach((ray, index) => add(ray, { opacity: returning ? [origins[index + 1].opacity, 1] : [0, 1] }, 300, defaultEase, returning ? 0 : (index + 1) * 100));
      break;
    case "moon":
      add(drawing, returning ? { transform: [rotation, "rotate(0deg)"] } : {
        transform: [0, -10, 10, -5, 5, 0].map((angle) => `rotate(${angle}deg)`),
        easing: "ease-in-out",
      }, 1200, returning ? "ease-in-out" : "linear");
      break;
    case "monitor":
      add(shapes[0], { opacity: returning ? [origins[0].opacity, 1] : [1, 0, 1] }, returning ? 300 : 600, returning ? defaultEase : "ease-in-out");
      break;
    case "linkedin":
      shapes.forEach((shape, index) => {
        add(shape, { opacity: returning ? [origins[index].opacity, 1] : [0, 1] }, 100);
        add(shape, { strokeDasharray: returning ? [origins[index].dash, "1 1"] : ["0 1", "1 1"] }, returning ? 400 : 600, returning ? defaultEase : "linear");
        add(shape, { strokeDashoffset: returning ? [origins[index].offset, 0] : [-1, 0] }, returning ? 400 : 600, returning ? defaultEase : "linear");
      });
      break;
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
