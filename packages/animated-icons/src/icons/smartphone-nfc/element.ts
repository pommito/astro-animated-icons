import { createIconElement, type IconHandle } from "../../element";
import { smartphoneNfcRecipe } from "./definition";

export type SmartphoneNfcIconHandle = IconHandle;
const SmartphoneNfcElement = createIconElement(smartphoneNfcRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-smartphone-nfc": InstanceType<typeof SmartphoneNfcElement>;
  }
}

if (!customElements.get("grave-smartphone-nfc")) {
  customElements.define("grave-smartphone-nfc", SmartphoneNfcElement);
}
