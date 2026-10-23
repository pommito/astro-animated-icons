import { createIconElement, type IconHandle } from "../../element";
import { wavesLadderRecipe } from "./definition";

export type WavesLadderIconHandle = IconHandle;
const WavesLadderElement = createIconElement(wavesLadderRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-waves-ladder": InstanceType<typeof WavesLadderElement>;
  }
}

if (!customElements.get("grave-waves-ladder")) {
  customElements.define("grave-waves-ladder", WavesLadderElement);
}
