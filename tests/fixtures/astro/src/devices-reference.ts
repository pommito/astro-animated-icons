import * as originals from "./references/devices";
import { mountReferences } from "./upstream-reference";
import { captureReferencePose, sampleReference } from "./reference-playback";
import { createIconElement } from "../../../../packages/animated-icons/src/element";
import { createKeyboardRecipe } from "../../../../packages/animated-icons/src/icons/keyboard/definition";
import { comparisonRandom } from "./devices-random";
import type { ArrowLeftIconHandle as IconHandle } from "@grave/animated-icons/astro";

customElements.define("grave-keyboard-comparison", createIconElement(createKeyboardRecipe(comparisonRandom)));
for (const icon of document.querySelectorAll("[data-adapter] grave-keyboard")) {
  const replacement = document.createElement("grave-keyboard-comparison");
  for (const attribute of icon.attributes) replacement.setAttribute(attribute.name, attribute.value);
  replacement.append(...icon.childNodes);
  icon.replaceWith(replacement);
}

mountReferences(originals, "devices-seek");

document.addEventListener("devices-seek", event => {
  const time = (event as CustomEvent<number>).detail;
  for (const row of document.querySelectorAll<HTMLElement>("tr[data-phase='1']")) {
    if (row.dataset.icon === "smartphone-nfc") row.querySelectorAll("[data-adapter]").forEach(container => {
      container.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = time + 300; });
    });
    if (row.dataset.icon === "projector") {
      const body = row.querySelector("[data-adapter] g[data-motion]")!;
      body.getAnimations().forEach(animation => { animation.pause(); animation.currentTime = time + 300; });
      sampleReference(row.querySelector("[data-reference] svg g")!, time + 300);
    }
  }
});

document.addEventListener("devices-capture-return", () => {
  document.querySelectorAll<HTMLElement & IconHandle>("[data-adapter] [data-grave-icon]").forEach(icon => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(captureReferencePose);
  document.querySelectorAll("tr[data-phase]").forEach(row => row.removeAttribute("data-phase"));
});

document.addEventListener("devices-complete-phase", event => {
  const slug = (event as CustomEvent<string>).detail;
  for (const row of document.querySelectorAll<HTMLElement>(`tr[data-icon='${slug}']`)) {
    const selector = slug === "projector" ? "[data-reference] svg > path" : "[data-reference] path";
    if (slug === "projector") row.querySelectorAll(selector).forEach(element => sampleReference(element, 300, { complete: true }));
    if (slug === "projector") row.querySelectorAll("[data-adapter] path[data-motion]").forEach(element => {
      element.getAnimations().forEach(animation => animation.finish());
    });
    row.dataset.phase = "1";
  }
});
