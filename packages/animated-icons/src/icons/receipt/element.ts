import { createIconElement, type IconHandle } from "../../element";
import { receiptRecipe } from "./definition";

export type ReceiptIconHandle = IconHandle;

const ReceiptElement = createIconElement(receiptRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-receipt": InstanceType<typeof ReceiptElement>;
  }
}

if (!customElements.get("grave-receipt")) {
  customElements.define("grave-receipt", ReceiptElement);
}
