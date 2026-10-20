import { createIconElement, type IconHandle } from "../../element";
import { euroRecipe } from "./definition";

export type EuroIconHandle = IconHandle;

const EuroElement = createIconElement(euroRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-euro": InstanceType<typeof EuroElement>;
  }
}

if (!customElements.get("grave-euro")) {
  customElements.define("grave-euro", EuroElement);
}
