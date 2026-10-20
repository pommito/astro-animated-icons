import { createIconElement, type IconHandle } from "../../element";
import { handRecipe } from "./definition";

export type HandIconHandle = IconHandle;
const HandElement = createIconElement(handRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hand": InstanceType<typeof HandElement>;
  }
}

if (!customElements.get("grave-hand")) {
  customElements.define("grave-hand", HandElement);
}
