import { sampleReference } from "./reference-playback";
import * as originals from "./references/communication";
import { mountReferences } from "./upstream-reference";
import { visualElementStore } from "motion";

mountReferences(originals, "communication-seek");

for (const container of document.querySelectorAll<HTMLElement>("[data-reference]")) {
  const svg = container.querySelector("svg")!;
  svg.setAttribute("width", container.dataset.size!);
  svg.setAttribute("height", container.dataset.size!);
}

document.addEventListener("communication-signal-seek", event => {
  const time = (event as CustomEvent<number>).detail;
  document.querySelectorAll('[data-icon="phone-call"] [data-reference] svg').forEach(svg => sampleReference(svg, time + 300));
  document.querySelectorAll('[data-icon="phone-call"] [data-adapter]').forEach(container => {
    container.getAnimations({ subtree: true }).forEach(animation => {
      animation.pause();
      animation.currentTime = time + 300;
    });
  });
});

document.addEventListener("communication-capture-return", () => {
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(element => {
    const visual = visualElementStore.get(element);
    visual?.values.forEach((value, name) => {
      const current = name === "opacity" ? Number(getComputedStyle(element).opacity) : value.get();
      // Native stop samples wall time, so capture the seeked pose before a measured return.
      value.stop();
      value.jump(current);
    });
    visual?.render();
  });
});
