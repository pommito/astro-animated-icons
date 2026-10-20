import * as originals from "./references/media";
import { mountReferences } from "./upstream-reference";
import { visualElementStore } from "motion";
import { captureReferencePose, sampleReference } from "./reference-playback";

mountReferences(originals, "media-seek");

document.addEventListener("media-capture-return", (event) => {
  const time = (event as CustomEvent<number>).detail || 3250;
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach((element) => {
    if (!element.closest('tr[data-icon="drum"]')) {
      captureReferencePose(element);
      return;
    }
    const visual = visualElementStore.get(element);
    const before = new Map<string, number>();
    sampleReference(element, time - 5);
    visual?.values.forEach((value, name) => before.set(name, Number(value.get())));
    sampleReference(element, time);
    captureReferencePose(element);
    visual?.values.forEach((value, name) => value.setWithVelocity(before.get(name)!, value.get(), 5));
    visual?.render();
  });
});
