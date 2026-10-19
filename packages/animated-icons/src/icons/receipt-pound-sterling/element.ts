import { createIconElement, type IconHandle } from "../../element";
import { receiptPoundSterlingRecipe } from "./definition";

export type ReceiptPoundSterlingIconHandle = IconHandle;

const ReceiptPoundSterlingElement = createIconElement(receiptPoundSterlingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-receipt-pound-sterling": InstanceType<typeof ReceiptPoundSterlingElement>;
  }
}

if (!customElements.get("grave-receipt-pound-sterling")) {
  customElements.define("grave-receipt-pound-sterling", ReceiptPoundSterlingElement);
}
