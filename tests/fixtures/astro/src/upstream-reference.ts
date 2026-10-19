import { createElement, createRef, type ComponentType, type RefAttributes } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { AsyncMotionValueAnimation, visualElementStore } from "motion";
import { sampleReference } from "./reference-playback";
import type { ArrowLeftIconHandle } from "@grave/animated-icons/astro";

type ReferenceComponent = ComponentType<{ size?: number } & RefAttributes<ArrowLeftIconHandle>>;

export function mountReferences(originals: Record<string, ReferenceComponent>, seekEvent: string) {
  const references = new Map<Element, ArrowLeftIconHandle>();
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let playbackRevision = 0;

  for (const container of document.querySelectorAll<HTMLElement>("[data-reference]")) {
    const Component = originals[container.dataset.name as keyof typeof originals];
    const ref = createRef<ArrowLeftIconHandle>();
    flushSync(() =>
      createRoot(container).render(createElement(Component, { size: Number(container.dataset.size), ref })),
    );
    references.set(container, ref.current!);
  }

  async function playSamples(scope: ParentNode, returning: boolean) {
    const revision = ++playbackRevision;
    const completions: Promise<unknown>[] = [];
    scope.querySelectorAll<HTMLElement & ArrowLeftIconHandle>("[data-adapter] [data-grave-icon]").forEach((icon) => {
      if (returning) {
        icon.stopAnimation();
        completions.push(...icon.getAnimations({ subtree: true }).map((animation) => animation.finished));
      } else icon.startAnimation();
    });
    if (!reducedMotion.matches) {
      scope.querySelectorAll("[data-reference]").forEach((container) => {
        const icon = references.get(container)!;
        if (returning) completions.push(Promise.resolve(icon.stopAnimation()));
        else icon.startAnimation();
      });
    }
    await Promise.allSettled(completions);
    return revision === playbackRevision;
  }

  for (const [id, returning] of [
    ["play", false],
    ["stop", true],
  ] as const) {
    document.querySelector(`#${id}`)!.addEventListener("click", () => {
      playSamples(document, returning);
    });
  }

  for (const row of document.querySelectorAll<HTMLTableRowElement>("tr[data-icon]")) {
    row.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch") playSamples(row, false);
    });
    row.addEventListener("pointerleave", (event) => {
      if (event.pointerType !== "touch") playSamples(row, true);
    });
    row.querySelector("[data-replay]")!.addEventListener("click", async () => {
      if (await playSamples(row, true)) playSamples(row, false);
    });
  }

  document.addEventListener(seekEvent, (event) => {
    playbackRevision++;
    const milliseconds = (event as CustomEvent<number>).detail;
    document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach((element) => {
      sampleReference(element, milliseconds);
    });
    document.getAnimations().forEach((animation) => {
      animation.pause();
      animation.currentTime = milliseconds;
    });
  });

  document.querySelector("#seek")!.addEventListener("click", () => {
    document.dispatchEvent(
      new CustomEvent(seekEvent, { detail: Number(document.querySelector<HTMLInputElement>("#time")!.value) }),
    );
  });

  reducedMotion.addEventListener("change", () => {
    if (!reducedMotion.matches) return;
    playbackRevision++;
    references.forEach((icon) => icon.stopAnimation());
    document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach((element) => {
      const visual = visualElementStore.get(element);
      visual?.values.forEach((value) => {
        if (value.animation instanceof AsyncMotionValueAnimation) value.animation.complete();
      });
    });
  });
  document.body.dataset.referencesReady = "true";
}
