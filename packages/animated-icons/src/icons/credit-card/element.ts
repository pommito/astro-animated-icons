import { createIconElement, type IconHandle } from "../../element";
import { creditCardRecipe } from "./definition";

export type CreditCardIconHandle = IconHandle;

const CreditCardElement = createIconElement(creditCardRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-credit-card": InstanceType<typeof CreditCardElement>;
  }
}

if (!customElements.get("grave-credit-card")) {
  customElements.define("grave-credit-card", CreditCardElement);
}
