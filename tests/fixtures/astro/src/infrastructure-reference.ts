import * as originals from "./references/infrastructure";
import { mountReferences } from "./upstream-reference";
import { captureReferencePose } from "./reference-playback";

mountReferences(originals, "infrastructure-seek");

for (const container of document.querySelectorAll<HTMLElement>("[data-reference]")) {
  const svg = container.querySelector("svg")!;
  svg.setAttribute("width", container.dataset.size!);
  svg.setAttribute("height", container.dataset.size!);
}

document.addEventListener("infrastructure-capture-return", () => {
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(element => captureReferencePose(element));
});
