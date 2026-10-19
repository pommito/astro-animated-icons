import { createIconElement, type IconHandle } from "../../element";
import { receiptSwissFrancRecipe } from "./definition";

export type ReceiptSwissFrancIconHandle = IconHandle;

const ReceiptSwissFrancElement = createIconElement(receiptSwissFrancRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-receipt-swiss-franc": InstanceType<typeof ReceiptSwissFrancElement>;
  }
}

if (!customElements.get("grave-receipt-swiss-franc")) {
  customElements.define("grave-receipt-swiss-franc", ReceiptSwissFrancElement);
}
