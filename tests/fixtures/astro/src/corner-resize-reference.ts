import * as originals from "./references/corner-resize";
import { mountReferences } from "./upstream-reference";
import { sampleReference } from "./reference-playback";

mountReferences(originals, "corner-resize-seek");

document.addEventListener("corner-resize-complete-entry", () => {
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach((element) => {
    sampleReference(element, 2000, { complete: true, resetVelocity: true });
  });
  document.querySelectorAll("[data-adapter]").forEach((element) => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
  });
});
