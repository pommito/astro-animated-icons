import { createIconElement } from "../../element";
import { nfcRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type NfcIconHandle = IconHandle;

const NfcElement = createIconElement(nfcRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-nfc": InstanceType<typeof NfcElement>;
  }
}

if (!customElements.get("grave-nfc")) {
  customElements.define("grave-nfc", NfcElement);
}
