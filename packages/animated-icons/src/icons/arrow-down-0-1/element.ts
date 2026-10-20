import { createIconElement, type IconHandle } from "../../element";
import { arrowDown01Recipe } from "./definition";

export type ArrowDown01IconHandle = IconHandle;

const ArrowDown01Element = createIconElement(arrowDown01Recipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-down-0-1": InstanceType<typeof ArrowDown01Element>;
  }
}

if (!customElements.get("grave-arrow-down-0-1")) {
  customElements.define("grave-arrow-down-0-1", ArrowDown01Element);
}
