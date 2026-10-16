import { chevrons } from "../../../helpers/chevrons";
import type { ChevronDownIconHandle } from "@grave/animated-icons/astro";

const references = new Map<Element, Animation[]>();
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

function resetReference(control: Element) {
  references.get(control)?.forEach((animation) => animation.cancel());
  references.delete(control);
}

function playReference(control: Element, returning = false) {
  const icon = chevrons.find((icon) => icon.slug === control.getAttribute("data-icon"))!;
  const paths = [...control.querySelectorAll("path")].slice(0, icon.kind === "spring" ? 2 : 1);
  const origins = paths.map((path, index) => {
    const position = () => {
      const matrix = new DOMMatrix(getComputedStyle(path).transform);
      return icon.axis === "X" ? matrix.m41 : matrix.m42;
    };
    const origin = position();
    const previous = references.get(control)?.[index];
    let velocity = 0;
    if (previous && Number(previous.currentTime) > 0) {
      const time = Number(previous.currentTime);
      previous.currentTime = Math.max(0, time - 5);
      velocity = (origin - position()) / (Math.min(time, 5) / 1000);
      previous.currentTime = time;
    }
    return { origin, velocity };
  });
  resetReference(control);
  if (reducedMotion.matches) return;
  const animations = paths.map((path, index) => {
    const { origin, velocity } = origins[index];
    const transform = (value: number) => `translate${icon.axis}(${value}px)`;
    let duration = icon.kind === "first" ? (returning ? 300 : 600) : 500;
    let frames: Keyframe[];
    if (icon.kind === "spring") {
      const target = returning ? 0 : icon.values[index];
      const displacement = origin - target;
      const decay = 12.5;
      const frequency = Math.sqrt(250 - decay * decay);
      const coefficient = (velocity + decay * displacement) / frequency;
      frames = [];
      for (let time = 0; time <= 2000; time += 5) {
        const seconds = time / 1000;
        const cosine = Math.cos(frequency * seconds);
        const sine = Math.sin(frequency * seconds);
        const envelope = Math.exp(-decay * seconds);
        const position = target + envelope * (displacement * cosine + coefficient * sine);
        const speed = envelope * ((coefficient * frequency - decay * displacement) * cosine - (displacement * frequency + decay * coefficient) * sine);
        const done = time > 0 && Math.abs(position - target) <= 0.005 && Math.abs(speed) <= 0.01;
        frames.push({ transform: transform(done ? target : position) });
        if (done) { duration = time; break; }
      }
    } else if (returning) {
      frames = [{ transform: transform(origin), easing: "ease-out" }, { transform: transform(0) }];
    } else {
      const times = icon.kind === "first" ? [0, 0.3, 0.7, 1] : [0, 0.4, 1];
      frames = icon.values.map((value, index) => ({ transform: transform(value), offset: times[index], easing: icon.kind === "first" ? "ease-in-out" : "ease-out" }));
    }
    return path.animate(frames, { duration, easing: "linear", fill: "both" });
  });
  references.set(control, animations);
  if (returning || icon.kind !== "spring") {
    let remaining = animations.length;
    for (const animation of animations) animation.addEventListener("finish", () => {
      if (--remaining === 0 && references.get(control) === animations) resetReference(control);
    }, { once: true });
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
    document.querySelectorAll<HTMLElement & ChevronDownIconHandle>("[data-adapter] [data-grave-icon]").forEach((icon) => returning ? icon.stopAnimation() : icon.startAnimation());
    document.querySelectorAll("[data-reference]").forEach((control) => playReference(control, returning));
  });
}
reducedMotion.addEventListener("change", () => {
  if (reducedMotion.matches) document.querySelectorAll("[data-reference]").forEach(resetReference);
});
window.addEventListener("pagehide", () => document.querySelectorAll("[data-reference]").forEach(resetReference));
