import { createIconElement } from "../../element";
import { fingerprintRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type FingerprintIconHandle = IconHandle;

const FingerprintElement = createIconElement(fingerprintRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-fingerprint": InstanceType<typeof FingerprintElement>;
  }
}

if (!customElements.get("grave-fingerprint")) {
  customElements.define("grave-fingerprint", FingerprintElement);
}
