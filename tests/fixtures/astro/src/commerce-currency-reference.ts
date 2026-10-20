import * as originals from "./references/commerce-currency";
import { mountReferences } from "./upstream-reference";
import type { CreditCardIconHandle } from "@grave/animated-icons/astro";
import { captureReferencePoseExcept, sampleReference } from "./reference-playback";

mountReferences(originals, "commerce-currency-seek");

let capturedTime: number | undefined;
document.addEventListener("commerce-currency-capture-return", (event) => {
  capturedTime = (event as CustomEvent<number>).detail;
  document.querySelectorAll<HTMLElement & CreditCardIconHandle>("[data-adapter] grave-credit-card").forEach(icon => {
    icon.stopAnimation();
    icon.getAnimations({ subtree: true }).forEach(animation => { animation.pause(); animation.currentTime = 0; });
  });
  document.querySelectorAll("[data-reference] svg, [data-reference] svg *").forEach(element => {
    captureReferencePoseExcept(element, element.matches('tr[data-icon="cart"] [data-reference] svg') ? ["y"] : []);
  });
});

document.addEventListener("commerce-currency-seek", (event) => {
  if (capturedTime === undefined) return;
  const time = (event as CustomEvent<number>).detail;
  document.querySelectorAll('tr[data-icon="cart"] [data-reference] svg').forEach(element => {
    sampleReference(element, capturedTime! + time, { properties: ["y"] });
  });
});
