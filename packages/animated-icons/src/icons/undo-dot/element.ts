import { createIconElement } from "../../element";
import { undoDotRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type UndoDotIconHandle = IconHandle;

const UndoDotElement = createIconElement(undoDotRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-undo-dot": InstanceType<typeof UndoDotElement>;
  }
}

if (!customElements.get("grave-undo-dot")) {
  customElements.define("grave-undo-dot", UndoDotElement);
}
