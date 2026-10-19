import { createIconElement, type IconHandle } from "../../element";
import { receiptCentRecipe } from "./definition";

export type ReceiptCentIconHandle = IconHandle;

const ReceiptCentElement = createIconElement(receiptCentRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-receipt-cent": InstanceType<typeof ReceiptCentElement>;
  }
}

if (!customElements.get("grave-receipt-cent")) {
  customElements.define("grave-receipt-cent", ReceiptCentElement);
}
