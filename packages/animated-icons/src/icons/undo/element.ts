import { createIconElement } from "../../element";
import { undoRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type UndoIconHandle = IconHandle;

const UndoElement = createIconElement(undoRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-undo": InstanceType<typeof UndoElement>;
  }
}

if (!customElements.get("grave-undo")) {
  customElements.define("grave-undo", UndoElement);
}
