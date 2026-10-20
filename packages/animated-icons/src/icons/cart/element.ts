import { createIconElement, type IconHandle } from "../../element";
import { cartRecipe } from "./definition";

export type CartIconHandle = IconHandle;

const CartElement = createIconElement(cartRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cart": InstanceType<typeof CartElement>;
  }
}

if (!customElements.get("grave-cart")) {
  customElements.define("grave-cart", CartElement);
}
