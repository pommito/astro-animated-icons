import { createIconElement } from "../../../../../packages/animated-icons/src/element";
import { createPaintProof, type PaintProofPlan } from "./runtime";
import { decodePaint } from "./codec.mjs";

function discover(root: ParentNode) {
  for (const host of root.querySelectorAll<HTMLElement>("[data-pp-recipe][data-pp-id]")) {
    if (!customElements.get(host.localName)) {
      customElements.define(host.localName, createIconElement(createPaintProof(decodePaint(JSON.parse(host.dataset.ppRecipe!)) as PaintProofPlan)));
    }
  }
  for (const template of root.querySelectorAll("template")) discover(template.content);
}
discover(document);
document.addEventListener("astro:page-load", () => discover(document));
