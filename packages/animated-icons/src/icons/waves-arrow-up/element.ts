import { createIconElement, type IconHandle } from "../../element";
import { wavesArrowUpRecipe } from "./definition";

export type WavesArrowUpIconHandle = IconHandle;
const WavesArrowUpElement = createIconElement(wavesArrowUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-waves-arrow-up": InstanceType<typeof WavesArrowUpElement>;
  }
}

if (!customElements.get("grave-waves-arrow-up")) {
  customElements.define("grave-waves-arrow-up", WavesArrowUpElement);
}
