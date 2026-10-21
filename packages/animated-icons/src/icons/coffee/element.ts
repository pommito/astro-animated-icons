import { createIconElement, type IconHandle } from "../../element";
import { coffeeRecipe } from "./definition";

export type CoffeeIconHandle = IconHandle;
const CoffeeElement = createIconElement(coffeeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-coffee": InstanceType<typeof CoffeeElement>;
  }
}

if (!customElements.get("grave-coffee")) {
  customElements.define("grave-coffee", CoffeeElement);
}
