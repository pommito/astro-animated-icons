import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";
import * as originals from "./references/hands-gestures";
import { mountReferences } from "./upstream-reference";
import { AsyncMotionValueAnimation, JSAnimation, visualElementStore } from "motion";
import { captureReferencePose, sampleReference } from "./reference-playback";

const returningRows = new WeakSet<Element>();
mountReferences(originals, "hands-gestures-seek", (scope, returning) => {
  const rows = scope instanceof HTMLTableRowElement ? [scope] : scope.querySelectorAll("tr[data-icon]");
  for (const row of rows) {
    if (returning) returningRows.add(row);
    else returningRows.delete(row);
  }
});

document.addEventListener("hands-gestures-capture-return", () => {
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach(icon => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
});

document.addEventListener("hands-gestures-seek", event => {
  const milliseconds = (event as CustomEvent<number>).detail;
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(element => {
    if (!returningRows.has(element.closest("tr[data-icon]")!)) return;
    visualElementStore.get(element)?.values.forEach((value, name) => {
      const animation = value.animation;
      if (!(animation instanceof AsyncMotionValueAnimation) || !(animation.animation instanceof JSAnimation)) return;
      const end = animation.iterationDuration * 1000;
      // Paused JS seeks otherwise sample the spring beyond its actual completion.
      if (milliseconds > end) sampleReference(element, end, { properties: [name] });
    });
  });
});
