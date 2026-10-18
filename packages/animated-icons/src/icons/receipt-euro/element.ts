import { createIconElement, type IconHandle } from "../../element";
import { receiptEuroRecipe } from "./definition";

export type ReceiptEuroIconHandle = IconHandle;

const ReceiptEuroElement = createIconElement(receiptEuroRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-receipt-euro": InstanceType<typeof ReceiptEuroElement>;
  }
}

if (!customElements.get("grave-receipt-euro")) {
  customElements.define("grave-receipt-euro", ReceiptEuroElement);
}
