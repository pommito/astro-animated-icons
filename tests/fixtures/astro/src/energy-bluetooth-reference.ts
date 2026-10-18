import { mountReferences } from "./upstream-reference";
import * as originals from "./references/energy-bluetooth";

mountReferences(originals, "energy-bluetooth-seek");

document.addEventListener("energy-bluetooth-level-seek", (event) => {
  const milliseconds = (event as CustomEvent<number>).detail;
  for (const row of document.querySelectorAll('[data-icon="battery-full"], [data-icon="battery-low"], [data-icon="battery-medium"]')) {
    for (const [selector, offset] of [["[data-adapter]", 400], ["[data-reference]", 0]] as const) {
      row.querySelector(selector)!.getAnimations({ subtree: true }).forEach((animation) => {
        animation.pause();
        animation.currentTime = milliseconds + offset;
      });
    }
  }
});
