import { createIconElement, type IconHandle } from "../../element";
import { receiptTextRecipe } from "./definition";

export type ReceiptTextIconHandle = IconHandle;

const ReceiptTextElement = createIconElement(receiptTextRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-receipt-text": InstanceType<typeof ReceiptTextElement>;
  }
}

if (!customElements.get("grave-receipt-text")) {
  customElements.define("grave-receipt-text", ReceiptTextElement);
}
