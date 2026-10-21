import { createIconElement, type IconHandle } from "../../element";
import { maximize2Recipe } from "./definition";

export type Maximize2IconHandle = IconHandle;

const Maximize2Element = createIconElement(maximize2Recipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-maximize-2": InstanceType<typeof Maximize2Element>;
  }
}

if (!customElements.get("grave-maximize-2")) {
  customElements.define("grave-maximize-2", Maximize2Element);
}
