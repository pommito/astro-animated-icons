import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";
import * as originals from "./references/transport-routes";
import { mountReferences } from "./upstream-reference";
import { captureReferencePose } from "./reference-playback";
import { AsyncMotionValueAnimation, JSAnimation, svgEffect } from "motion";

mountReferences(originals, "transport-routes-seek");

document.addEventListener("transport-routes-seek", event => {
  const milliseconds = (event as CustomEvent<number>).detail;
  document.querySelectorAll<SVGPathElement>("[data-adapter] grave-rocket path:first-child").forEach(path => {
    const value = svgEffect.get(path, "attrD");
    if (value?.animation instanceof AsyncMotionValueAnimation) {
      const animation = value.animation;
      animation.pause();
      animation.time = milliseconds / 1000;
      if (animation.animation instanceof JSAnimation) animation.animation.sample(milliseconds);
    }
    svgEffect.flush(path);
  });
});

document.addEventListener("transport-routes-capture-return", () => {
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach(icon => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
});
