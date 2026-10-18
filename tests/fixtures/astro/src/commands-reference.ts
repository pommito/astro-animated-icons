import * as originals from "./references/commands";
import { mountReferences } from "./upstream-reference";
import { AsyncMotionValueAnimation, JSAnimation, svgEffect } from "motion";

mountReferences(originals, "commands-seek");

document.addEventListener("commands-seek", (event) => {
  const milliseconds = (event as CustomEvent<number>).detail;
  document.querySelectorAll<SVGLineElement>("[data-adapter] grave-sliders-horizontal line").forEach((line) => {
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
