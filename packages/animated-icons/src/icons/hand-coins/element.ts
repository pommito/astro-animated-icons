import { createIconElement, type IconHandle } from "../../element";
import { handCoinsRecipe } from "./definition";

export type HandCoinsIconHandle = IconHandle;
const HandCoinsElement = createIconElement(handCoinsRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-hand-coins": InstanceType<typeof HandCoinsElement>;
  }
}

if (!customElements.get("grave-hand-coins")) {
  customElements.define("grave-hand-coins", HandCoinsElement);
}
