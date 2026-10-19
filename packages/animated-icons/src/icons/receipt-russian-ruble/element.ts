import { createIconElement, type IconHandle } from "../../element";
import { receiptRussianRubleRecipe } from "./definition";

export type ReceiptRussianRubleIconHandle = IconHandle;

const ReceiptRussianRubleElement = createIconElement(receiptRussianRubleRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-receipt-russian-ruble": InstanceType<typeof ReceiptRussianRubleElement>;
  }
}

if (!customElements.get("grave-receipt-russian-ruble")) {
  customElements.define("grave-receipt-russian-ruble", ReceiptRussianRubleElement);
}
