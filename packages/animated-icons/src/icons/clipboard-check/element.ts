import { createIconElement, type IconHandle } from "../../element";
import { clipboardCheckRecipe } from "./definition";

export type ClipboardCheckIconHandle = IconHandle;

const ClipboardCheckElement = createIconElement(clipboardCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-clipboard-check": InstanceType<typeof ClipboardCheckElement>;
  }
}

if (!customElements.get("grave-clipboard-check")) {
  customElements.define("grave-clipboard-check", ClipboardCheckElement);
}
