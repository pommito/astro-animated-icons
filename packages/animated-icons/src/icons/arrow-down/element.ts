import { createIconElement } from "../../element";
import { arrowDownRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowDownIconHandle = IconHandle;

const ArrowDownElement = createIconElement(arrowDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-down": InstanceType<typeof ArrowDownElement>;
  }
}

if (!customElements.get("grave-arrow-down")) {
  customElements.define("grave-arrow-down", ArrowDownElement);
}
