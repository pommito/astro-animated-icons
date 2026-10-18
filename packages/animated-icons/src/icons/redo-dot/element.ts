import { createIconElement } from "../../element";
import { redoDotRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type RedoDotIconHandle = IconHandle;

const RedoDotElement = createIconElement(redoDotRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-redo-dot": InstanceType<typeof RedoDotElement>;
  }
}

if (!customElements.get("grave-redo-dot")) {
  customElements.define("grave-redo-dot", RedoDotElement);
}
