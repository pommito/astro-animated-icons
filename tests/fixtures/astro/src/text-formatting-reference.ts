import * as originals from "./references/text-formatting";
import { mountReferences } from "./upstream-reference";
import { AsyncMotionValueAnimation, JSAnimation, svgEffect } from "motion";
import { captureReferencePose } from "./reference-playback";
import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";

mountReferences(originals, "text-formatting-seek");

document.addEventListener("text-formatting-seek", event => {
  const milliseconds = (event as CustomEvent<number>).detail;
  document.querySelectorAll<SVGLineElement>("[data-adapter] line").forEach(line => {
    for (const property of ["x1", "x2"]) {
      const value = svgEffect.get(line, property);
      if (value?.animation instanceof AsyncMotionValueAnimation) {
        const animation = value.animation;
        animation.pause();
        animation.time = milliseconds / 1000;
        if (animation.animation instanceof JSAnimation) animation.animation.sample(milliseconds);
      }
    }
    svgEffect.flush(line);
  });
});

document.addEventListener("text-formatting-capture-return", () => {
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach(icon => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
    icon.querySelectorAll<SVGLineElement>("line").forEach(line => {
      for (const property of ["x1", "x2"]) {
        const value = svgEffect.get(line, property);
        if (value) { value.stop(); value.jump(value.get()); }
      }
    });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
});
