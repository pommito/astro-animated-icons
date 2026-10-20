import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";
import * as originals from "./references/sorting-trends";
import { mountReferences } from "./upstream-reference";
import { AsyncMotionValueAnimation, JSAnimation, svgEffect } from "motion";
import { sampleReference, captureReferencePose, captureReferencePoseExcept } from "./reference-playback";

mountReferences(originals, "sorting-trends-seek");
let returnFrom: number | undefined;
document.querySelector("#play")!.addEventListener("click", () => { returnFrom = undefined; });

document.addEventListener("sorting-trends-seek", event => {
  const milliseconds = (event as CustomEvent<number>).detail;
  if (returnFrom !== undefined) {
    for (const row of document.querySelectorAll("tr[data-icon^=trending]")) {
      sampleReference(row.querySelector("[data-reference] svg")!, returnFrom + milliseconds, { properties: ["x", "y", "translateX", "translateY"] });
      row.querySelectorAll("[data-reference] polyline").forEach(shape => sampleReference(shape, returnFrom! + milliseconds, { properties: ["pathOffset"] }));
    }
  }
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

document.addEventListener("sorting-trends-capture-return", event => {
  returnFrom = (event as CustomEvent<number>).detail;
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach(icon => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(element => {
    const trend = element.closest("tr[data-icon^=trending]");
    if (trend) captureReferencePoseExcept(element, element.localName === "svg" ? ["x", "y", "translateX", "translateY"] : ["pathOffset"]);
    else captureReferencePose(element);
  });
});
