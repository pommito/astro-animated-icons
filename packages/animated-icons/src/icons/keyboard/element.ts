import { createIconElement, type IconHandle } from "../../element";
import { keyboardRecipe } from "./definition";

export type KeyboardIconHandle = IconHandle;
const KeyboardElement = createIconElement(keyboardRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-keyboard": InstanceType<typeof KeyboardElement>;
  }
}

if (!customElements.get("grave-keyboard")) {
  customElements.define("grave-keyboard", KeyboardElement);
}
