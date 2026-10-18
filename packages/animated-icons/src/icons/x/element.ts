import { createIconElement } from "../../element";
import { xRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type XIconHandle = IconHandle;

const XElement = createIconElement(xRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-x": InstanceType<typeof XElement>;
  }
}

if (!customElements.get("grave-x")) {
  customElements.define("grave-x", XElement);
}
