import * as originals from "./references/layout-gallery";
import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";
import { visualElementStore, AsyncMotionValueAnimation } from "motion";
import { mountReferences } from "./upstream-reference";
import { captureReferencePose, sampleReference } from "./reference-playback";

mountReferences(originals, "layout-gallery-seek");

document.addEventListener("layout-gallery-capture-return", () => {
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach(icon => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
});

document.addEventListener("layout-gallery-next-stage", () => {
  document.querySelectorAll<HTMLElement>("tr[data-icon='layers']").forEach(row => {
    const reference = [...row.querySelectorAll("[data-reference] path")].slice(1).map(path => {
      const animation = visualElementStore.get(path)?.values.get("y")?.animation;
      return animation instanceof AsyncMotionValueAnimation ? animation.duration : null;
    });
    const adapter = row.querySelector("[data-adapter] [data-grave-icon]")!.getAnimations({ subtree: true }).map(animation => Number(animation.effect!.getComputedTiming().activeDuration) / 1000);
    row.dataset.stageDurations = JSON.stringify({ reference, adapter });
  });
  document.querySelectorAll("tr[data-icon='layers'] [data-reference] path").forEach(element => {
    sampleReference(element, 2000, { complete: true, resetVelocity: true });
  });
  document.querySelectorAll("tr[data-icon='layers'] [data-adapter] [data-grave-icon]").forEach(element => {
    element.getAnimations({ subtree: true }).forEach(animation => animation.finish());
  });
});
