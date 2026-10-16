import { createIconElement } from "../../element";
import { atSignRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type AtSignIconHandle = IconHandle;

const AtSignElement = createIconElement(atSignRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-at-sign": InstanceType<typeof AtSignElement>;
  }
}

if (!customElements.get("grave-at-sign")) {
  customElements.define("grave-at-sign", AtSignElement);
}
