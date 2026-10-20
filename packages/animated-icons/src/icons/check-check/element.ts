import { createIconElement, type IconHandle } from "../../element";
import { checkCheckRecipe } from "./definition";

export type CheckCheckIconHandle = IconHandle;
const CheckCheckElement = createIconElement(checkCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-check-check": InstanceType<typeof CheckCheckElement>;
  }
}

if (!customElements.get("grave-check-check")) {
  customElements.define("grave-check-check", CheckCheckElement);
}
