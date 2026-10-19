import { createIconElement, type IconHandle } from "../../element";
import { receiptIndianRupeeRecipe } from "./definition";

export type ReceiptIndianRupeeIconHandle = IconHandle;

const ReceiptIndianRupeeElement = createIconElement(receiptIndianRupeeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-receipt-indian-rupee": InstanceType<typeof ReceiptIndianRupeeElement>;
  }
}

if (!customElements.get("grave-receipt-indian-rupee")) {
  customElements.define("grave-receipt-indian-rupee", ReceiptIndianRupeeElement);
}
