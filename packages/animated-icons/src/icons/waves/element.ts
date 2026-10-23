import { createIconElement, type IconHandle } from "../../element";
import { wavesRecipe } from "./definition";

export type WavesIconHandle = IconHandle;
const WavesElement = createIconElement(wavesRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-waves": InstanceType<typeof WavesElement>;
  }
}

if (!customElements.get("grave-waves")) {
  customElements.define("grave-waves", WavesElement);
}
