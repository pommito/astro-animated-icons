import { createIconElement, type IconHandle } from "../../element";
import { hammerRecipe } from "./definition";

export type HammerIconHandle = IconHandle;
const HammerElement = createIconElement(hammerRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hammer": InstanceType<typeof HammerElement>;
  }
}

if (!customElements.get("grave-hammer")) {
  customElements.define("grave-hammer", HammerElement);
}
