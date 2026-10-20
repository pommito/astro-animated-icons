import { createIconElement, type IconHandle } from "../../element";
import { cursorClickRecipe } from "./definition";

export type CursorClickIconHandle = IconHandle;
const CursorClickElement = createIconElement(cursorClickRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cursor-click": InstanceType<typeof CursorClickElement>;
  }
}

if (!customElements.get("grave-cursor-click")) {
  customElements.define("grave-cursor-click", CursorClickElement);
}
