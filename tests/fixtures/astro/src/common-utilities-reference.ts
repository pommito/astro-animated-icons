import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";
import * as originals from "./references/common-utilities";
import { mountReferences } from "./upstream-reference";
import { AsyncMotionValueAnimation, JSAnimation, svgEffect } from "motion";
import { captureReferencePose } from "./reference-playback";

mountReferences(originals, "common-utilities-seek");

document.addEventListener("common-utilities-seek", event => {
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

document.addEventListener("common-utilities-capture-return", () => {
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach(icon => {
    const path = icon.querySelector<SVGElement>("[data-part='0']");
    const opacity = icon.localName === "grave-users-round" ? Number(getComputedStyle(path!).opacity) : undefined;
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
    if (opacity !== undefined) {
      const value = svgEffect.get(path!, "opacity");
      value?.stop();
      value?.jump(opacity);
      svgEffect.flush(path!);
    }
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
});
