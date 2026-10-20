import { createIconElement, type IconHandle } from "../../element";
import { arrowDown10Recipe } from "./definition";

export type ArrowDown10IconHandle = IconHandle;

const ArrowDown10Element = createIconElement(arrowDown10Recipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-down-1-0": InstanceType<typeof ArrowDown10Element>;
  }
}

if (!customElements.get("grave-arrow-down-1-0")) {
  customElements.define("grave-arrow-down-1-0", ArrowDown10Element);
}
