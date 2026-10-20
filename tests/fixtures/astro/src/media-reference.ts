import * as originals from "./references/media";
import { mountReferences } from "./upstream-reference";
import { visualElementStore } from "motion";
import { sampleReference } from "./reference-playback";

mountReferences(originals, "media-seek");

document.addEventListener("media-capture-return", (event) => {
  const time = (event as CustomEvent<number>).detail || 3250;
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach((element) => {
    const visual = visualElementStore.get(element);
    const drum = !!element.closest('tr[data-icon="drum"]');
    const before = new Map<string, number>();
    if (drum) {
      sampleReference(element, time - 5);
      visual?.values.forEach((value, name) => before.set(name, Number(value.get())));
      sampleReference(element, time);
    }
    visual?.values.forEach((value, name) => {
      const current = name === "opacity" ? Number(getComputedStyle(element).opacity) : value.get();
      // Upstream native stop samples wall time, so preserve the seeked pose before a measured return.
      value.stop();
      value.jump(current);
      if (drum) value.setWithVelocity(before.get(name)!, current, 5);
    });
    visual?.render();
  });
});
