import * as originals from "./references/cloud";
import { mountReferences } from "./upstream-reference";
import { visualElementStore } from "motion";

mountReferences(originals, "cloud-seek");

document.addEventListener("cloud-capture-return", () => {
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach((element) => {
    const visual = visualElementStore.get(element);
    visual?.values.forEach((value, name) => {
      const current = name === "opacity" ? Number(getComputedStyle(element).opacity) : value.get();
      // Upstream native stop samples wall time, so preserve the seeked pose before a measured return.
      value.stop();
      value.jump(current);
    });
    visual?.render();
  });
});
