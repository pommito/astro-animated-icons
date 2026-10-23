import { createIconElement, type IconHandle } from "../../element";
import { wavesArrowDownRecipe } from "./definition";

export type WavesArrowDownIconHandle = IconHandle;
const WavesArrowDownElement = createIconElement(wavesArrowDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-waves-arrow-down": InstanceType<typeof WavesArrowDownElement>;
  }
}

if (!customElements.get("grave-waves-arrow-down")) {
  customElements.define("grave-waves-arrow-down", WavesArrowDownElement);
}
