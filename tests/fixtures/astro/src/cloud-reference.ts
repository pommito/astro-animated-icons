import * as originals from "./references/cloud";
import { mountReferences } from "./upstream-reference";
import { captureReferencePose } from "./reference-playback";

mountReferences(originals, "cloud-seek");

document.addEventListener("cloud-capture-return", () => {
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
});
