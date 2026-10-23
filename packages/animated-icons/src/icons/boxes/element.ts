import { createIconElement, type IconHandle } from "../../element";
import { boxesRecipe } from "./definition";

export type BoxesIconHandle = IconHandle;
const BoxesElement = createIconElement(boxesRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-boxes": InstanceType<typeof BoxesElement>;
  }
}

if (!customElements.get("grave-boxes")) {
  customElements.define("grave-boxes", BoxesElement);
}
