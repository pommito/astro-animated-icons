import { createIconElement, type IconHandle } from "../../element";
import { dollarSignRecipe } from "./definition";

export type DollarSignIconHandle = IconHandle;

const DollarSignElement = createIconElement(dollarSignRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-dollar-sign": InstanceType<typeof DollarSignElement>;
  }
}

if (!customElements.get("grave-dollar-sign")) {
  customElements.define("grave-dollar-sign", DollarSignElement);
}
