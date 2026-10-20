import { createIconElement, type IconHandle } from "../../element";
import { disc3Recipe } from "./definition";

export type Disc3IconHandle = IconHandle;

const Disc3Element = createIconElement(disc3Recipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-disc-3": InstanceType<typeof Disc3Element>;
  }
}

if (!customElements.get("grave-disc-3")) {
  customElements.define("grave-disc-3", Disc3Element);
}
