import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";
import * as originals from "./references/design-tools";
import { mountReferences } from "./upstream-reference";
import { captureReferencePose, sampleReference } from "./reference-playback";

mountReferences(originals, "design-tools-seek");

document.addEventListener("design-tools-capture-return", () => {
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach(icon => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
});

document.addEventListener("design-tools-complete-phase", () => {
  document.querySelectorAll("tr[data-icon=scan-text] [data-reference] path").forEach(element => sampleReference(element, 1000, { complete: true, resetVelocity: true }));
  document.querySelectorAll("tr[data-icon=scan-text] [data-adapter]").forEach(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
});
