import * as originals from "./references/security";
import { mountReferences } from "./upstream-reference";

mountReferences(originals, "security-seek");

import { AsyncMotionValueAnimation, JSAnimation, visualElementStore } from "motion";

document.addEventListener("security-finish-hidden", () => {
  document.querySelectorAll("[data-reference][data-name='ScanFace'] svg, [data-reference][data-name='ScanFace'] svg *").forEach((element) => {
    const visual = visualElementStore.get(element);
    visual?.values.forEach((value) => {
      if (value.animation instanceof AsyncMotionValueAnimation) {
        const animation = value.animation;
        animation.pause();
        animation.time = 2;
        if (animation.animation instanceof JSAnimation) animation.animation.sample(2000);
        // Completing a spring early would carry its transient velocity into the visible phase.
        value.jump(value.get(), false);
        animation.complete();
      }
    });
    visual?.render();
  });
  document.querySelectorAll("[data-adapter] grave-scan-face").forEach((element) => {
    element.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
  });
});
