import type { IconHandle } from "../../../../packages/animated-icons/src/element";

type Handle = HTMLElement & IconHandle;
const samples = (root: ParentNode) => [...root.querySelectorAll<Handle>("[data-sample]")];
await Promise.all([...new Set(samples(document).map(icon => icon.localName))].map(tag => customElements.whenDefined(tag)));
const compareRunning = () => document.querySelector<HTMLButtonElement>("#parity")?.disabled;
for (const section of document.querySelectorAll<HTMLElement>("[data-kind]")) {
  section.querySelector("[data-pair-play]")!.addEventListener("click", () => {
    if (!compareRunning()) samples(section).forEach(icon => icon.startAnimation());
  });
  section.querySelector("[data-pair-stop]")!.addEventListener("click", () => {
    if (!compareRunning()) samples(section).forEach(icon => icon.stopAnimation());
  });
  for (const row of section.querySelectorAll<HTMLElement>("[data-pair]")) {
    row.addEventListener("pointerenter", event => {
      if (event.pointerType === "mouse" && !compareRunning()) samples(row).forEach(icon => icon.startAnimation());
    });
    row.addEventListener("pointerleave", event => {
      if (event.pointerType === "mouse" && !compareRunning()) samples(row).forEach(icon => icon.stopAnimation());
    });
  }
}
