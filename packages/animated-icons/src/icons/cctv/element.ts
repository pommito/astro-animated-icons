import { createIconElement, type IconHandle } from "../../element";
import { cctvRecipe } from "./definition";

export type CctvIconHandle = IconHandle;
const CctvElement = createIconElement(cctvRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-cctv": InstanceType<typeof CctvElement>;
  }
}

if (!customElements.get("grave-cctv")) {
  customElements.define("grave-cctv", CctvElement);
}
