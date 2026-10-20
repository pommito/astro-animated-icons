import { createIconElement, type IconHandle } from "../../element";
import { micRecipe } from "./definition";

export type MicIconHandle = IconHandle;

const MicElement = createIconElement(micRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-mic": InstanceType<typeof MicElement>;
  }
}

if (!customElements.get("grave-mic")) {
  customElements.define("grave-mic", MicElement);
}
