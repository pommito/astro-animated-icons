import * as originals from "./references/directional-arrows";
import { mountReferences } from "./upstream-reference";
import { captureReferencePose } from "./reference-playback";
import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";

mountReferences(originals, "directional-arrows-seek");

document.addEventListener("directional-arrows-capture-return", () => {
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach((icon) => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = 0; });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
});
