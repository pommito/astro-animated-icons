import { mountReferences } from "./upstream-reference";
import * as originals from "./references/connectivity";

mountReferences(originals, "connectivity-seek");

document.addEventListener("connectivity-signal-seek", (event) => {
  const milliseconds = (event as CustomEvent<number>).detail;
  for (const row of document.querySelectorAll<HTMLTableRowElement>("tr[data-icon]")) {
    if (!["wifi", "wifi-low", "nfc", "router", "radio", "radio-tower"].includes(row.dataset.icon!)) continue;
    const fade = row.dataset.icon!.startsWith("wifi") ? 200 : 300;
    row.querySelector("[data-adapter]")!.getAnimations({ subtree: true }).forEach(animation => {
      animation.pause();
      animation.currentTime = milliseconds + fade;
    });
  }
});
