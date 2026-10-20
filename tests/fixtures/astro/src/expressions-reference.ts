import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";
import * as originals from "./references/expressions";
import { mountReferences } from "./upstream-reference";
import { AsyncMotionValueAnimation, JSAnimation, svgEffect, visualElementStore } from "motion";
import { sampleReference, captureReferencePose } from "./reference-playback";

mountReferences(originals, "expressions-seek");

document.addEventListener("expressions-seek", event => {
  const milliseconds = (event as CustomEvent<number>).detail;
  document.querySelectorAll<SVGPathElement>("[data-adapter] path").forEach(path => {
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

document.addEventListener("expressions-capture-return", () => {
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach(icon => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(element => {
    const value = visualElementStore.get(element)?.values.get("strokeWidth");
    if (value) {
      const width = parseFloat(getComputedStyle(element).strokeWidth);
      value.stop();
      value.jump(width);
    }
    captureReferencePose(element);
  });
});

document.addEventListener("expressions-complete-phase", () => {
  document.querySelectorAll("tr[data-icon=heart-pulse] [data-reference] svg *").forEach(element => sampleReference(element, 10000, { complete: true, resetVelocity: true }));
  document.querySelectorAll("tr[data-icon=heart-pulse] [data-adapter]").forEach(element => element.getAnimations({ subtree: true }).forEach(animation => animation.finish()));
});
