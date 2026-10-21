import { createIconElement, type IconHandle } from "../../element";
import { link2Recipe } from "./definition";

export type Link2IconHandle = IconHandle;
const Link2Element = createIconElement(link2Recipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-link-2": InstanceType<typeof Link2Element>;
  }
}

if (!customElements.get("grave-link-2")) {
  customElements.define("grave-link-2", Link2Element);
}
