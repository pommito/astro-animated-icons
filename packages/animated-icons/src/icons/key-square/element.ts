import { createIconElement } from "../../element";
import { keySquareRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type KeySquareIconHandle = IconHandle;

const KeySquareElement = createIconElement(keySquareRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-key-square": InstanceType<typeof KeySquareElement>;
  }
}

if (!customElements.get("grave-key-square")) {
  customElements.define("grave-key-square", KeySquareElement);
}
