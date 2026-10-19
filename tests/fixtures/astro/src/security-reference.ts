import { sampleReference } from "./reference-playback";
import * as originals from "./references/security";
import { mountReferences } from "./upstream-reference";

mountReferences(originals, "security-seek");


document.addEventListener("security-finish-hidden", () => {
  document.querySelectorAll("[data-reference][data-name='ScanFace'] svg, [data-reference][data-name='ScanFace'] svg *").forEach((element) => {
    sampleReference(element, 2000, { complete: true, resetVelocity: true });
  });
  document.querySelectorAll("[data-adapter] grave-scan-face").forEach((element) => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
  });
});
