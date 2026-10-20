import { createIconElement, type IconHandle } from "../../element";
import { handFistRecipe } from "./definition";

export type HandFistIconHandle = IconHandle;
const HandFistElement = createIconElement(handFistRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hand-fist": InstanceType<typeof HandFistElement>;
  }
}

if (!customElements.get("grave-hand-fist")) {
  customElements.define("grave-hand-fist", HandFistElement);
}
