import { createIconElement, type IconHandle } from "../../element";
import { receiptJapaneseYenRecipe } from "./definition";

export type ReceiptJapaneseYenIconHandle = IconHandle;

const ReceiptJapaneseYenElement = createIconElement(receiptJapaneseYenRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-receipt-japanese-yen": InstanceType<typeof ReceiptJapaneseYenElement>;
  }
}

if (!customElements.get("grave-receipt-japanese-yen")) {
  customElements.define("grave-receipt-japanese-yen", ReceiptJapaneseYenElement);
}
