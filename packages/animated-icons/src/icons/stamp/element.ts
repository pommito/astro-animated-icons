import { createIconElement, type IconHandle } from "../../element";
import { stampRecipe } from "./definition";

export type StampIconHandle = IconHandle;
const StampElement = createIconElement(stampRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-stamp": InstanceType<typeof StampElement>;
  }
}

if (!customElements.get("grave-stamp")) {
  customElements.define("grave-stamp", StampElement);
}
