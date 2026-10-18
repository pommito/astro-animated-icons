import { createIconElement } from "../../element";
import { keyRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type KeyIconHandle = IconHandle;

const KeyElement = createIconElement(keyRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-key": InstanceType<typeof KeyElement>;
  }
}

if (!customElements.get("grave-key")) {
  customElements.define("grave-key", KeyElement);
}
