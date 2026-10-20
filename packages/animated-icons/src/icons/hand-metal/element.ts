import { createIconElement, type IconHandle } from "../../element";
import { handMetalRecipe } from "./definition";

export type HandMetalIconHandle = IconHandle;
const HandMetalElement = createIconElement(handMetalRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hand-metal": InstanceType<typeof HandMetalElement>;
  }
}

if (!customElements.get("grave-hand-metal")) {
  customElements.define("grave-hand-metal", HandMetalElement);
}
