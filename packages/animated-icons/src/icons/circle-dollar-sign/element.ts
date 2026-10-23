import { createIconElement, type IconHandle } from "../../element";
import { circleDollarSignRecipe } from "./definition";

export type CircleDollarSignIconHandle = IconHandle;

const CircleDollarSignElement = createIconElement(circleDollarSignRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-circle-dollar-sign": InstanceType<typeof CircleDollarSignElement>;
  }
}

if (!customElements.get("grave-circle-dollar-sign")) {
  customElements.define("grave-circle-dollar-sign", CircleDollarSignElement);
}
