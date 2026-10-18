import { createIconElement } from "../../element";
import { redoRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type RedoIconHandle = IconHandle;

const RedoElement = createIconElement(redoRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-redo": InstanceType<typeof RedoElement>;
  }
}

if (!customElements.get("grave-redo")) {
  customElements.define("grave-redo", RedoElement);
}
