import * as originals from "./references/weather-nature";
import { mountReferences } from "./upstream-reference";
import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";
import { captureReferencePose } from "./reference-playback";

mountReferences(originals, "weather-nature-seek");

document.addEventListener("weather-nature-capture-return", () => {
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach(icon => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
});
