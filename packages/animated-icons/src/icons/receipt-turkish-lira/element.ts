import { createIconElement, type IconHandle } from "../../element";
import { receiptTurkishLiraRecipe } from "./definition";

export type ReceiptTurkishLiraIconHandle = IconHandle;

const ReceiptTurkishLiraElement = createIconElement(receiptTurkishLiraRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-receipt-turkish-lira": InstanceType<typeof ReceiptTurkishLiraElement>;
  }
}

if (!customElements.get("grave-receipt-turkish-lira")) {
  customElements.define("grave-receipt-turkish-lira", ReceiptTurkishLiraElement);
}
