import { createIconElement } from "../../element";
import { keyCircleRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type KeyCircleIconHandle = IconHandle;

const KeyCircleElement = createIconElement(keyCircleRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-key-circle": InstanceType<typeof KeyCircleElement>;
  }
}

if (!customElements.get("grave-key-circle")) {
  customElements.define("grave-key-circle", KeyCircleElement);
}
