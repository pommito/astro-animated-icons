import { createElement, createRef } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { AsyncMotionValueAnimation, JSAnimation, visualElementStore } from "motion";
import * as originals from "./references/folders";
import type { ArrowLeftIconHandle } from "@grave/animated-icons/astro";

const references: ArrowLeftIconHandle[] = [];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

for (const container of document.querySelectorAll<HTMLElement>("[data-reference]")) {
  const Component = originals[container.dataset.name as keyof typeof originals];
  const ref = createRef<ArrowLeftIconHandle>();
  flushSync(() =>
    createRoot(container).render(createElement(Component, { size: Number(container.dataset.size), ref })),
  );
  references.push(ref.current!);
}

for (const [id, returning] of [
  ["play", false],
  ["stop", true],
] as const) {
  document.querySelector(`#${id}`)!.addEventListener("click", () => {
    document
      .querySelectorAll<HTMLElement & ArrowLeftIconHandle>("[data-adapter] [data-grave-icon]")
      .forEach((icon) => (returning ? icon.stopAnimation() : icon.startAnimation()));
    if (!reducedMotion.matches)
      references.forEach((icon) => (returning ? icon.stopAnimation() : icon.startAnimation()));
  });
}

document.addEventListener("folder-seek", (event) => {
  const milliseconds = (event as CustomEvent<number>).detail;
  document.querySelectorAll("[data-reference] svg *").forEach((element) => {
    const visual = visualElementStore.get(element);
    visual?.values.forEach((value) => {
      if (value.animation instanceof AsyncMotionValueAnimation) {
        const animation = value.animation;
        animation.pause();
        animation.time = milliseconds / 1000;
        // JS seeks schedule a frame; sample synchronously for the comparison controls.
        if (animation.animation instanceof JSAnimation) animation.animation.sample(milliseconds);
      }
    });
    visual?.render();
  });
  document.getAnimations().forEach((animation) => {
    animation.pause();
    animation.currentTime = milliseconds;
  });
});

document.querySelector("#seek")!.addEventListener("click", () => {
  document.dispatchEvent(
    new CustomEvent("folder-seek", { detail: Number(document.querySelector<HTMLInputElement>("#time")!.value) }),
  );
});

reducedMotion.addEventListener("change", () => {
  if (!reducedMotion.matches) return;
  references.forEach((icon) => icon.stopAnimation());
  document.querySelectorAll("[data-reference] svg *").forEach((element) => {
    const visual = visualElementStore.get(element);
    visual?.values.forEach((value) => {
      if (value.animation instanceof AsyncMotionValueAnimation) value.animation.complete();
    });
  });
});
document.body.dataset.referencesReady = "true";
