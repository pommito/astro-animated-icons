import { createIconElement, type IconHandle } from "../../element";
import { boxRecipe } from "./definition";

export type BoxIconHandle = IconHandle;
const BoxElement = createIconElement(boxRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-box": InstanceType<typeof BoxElement>;
  }
}

if (!customElements.get("grave-box")) {
  customElements.define("grave-box", BoxElement);
}
