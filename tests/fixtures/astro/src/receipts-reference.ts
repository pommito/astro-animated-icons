import { sampleReference } from "./reference-playback";
import * as originals from "./references/receipts";
import { mountReferences } from "./upstream-reference";

mountReferences(originals, "receipts-seek");

for (const container of document.querySelectorAll<HTMLElement>("[data-reference][data-name='ReceiptSwissFranc']")) {
  const svg = container.querySelector("svg")!;
  svg.setAttribute("width", container.dataset.size!);
  svg.setAttribute("height", container.dataset.size!);
}

let visiblePhase = false;
document.addEventListener("receipts-finish-hidden", () => {
  visiblePhase = true;
  document.querySelectorAll("[data-reference][data-name='ReceiptText'] path").forEach((path) => {
    sampleReference(path, 1000, { complete: true });
  });
});

document.addEventListener("receipts-seek", (event) => {
  if (!visiblePhase) return;
  const time = (event as CustomEvent<number>).detail;
  document.querySelectorAll("[data-adapter] grave-receipt-text").forEach((icon) => {
    icon.getAnimations({ subtree: true }).forEach((animation) => { animation.pause(); animation.currentTime = time + 320; });
  });
});
