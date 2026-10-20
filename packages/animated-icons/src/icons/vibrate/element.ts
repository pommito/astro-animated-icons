import { createIconElement, type IconHandle } from "../../element";
import { vibrateRecipe } from "./definition";

export type VibrateIconHandle = IconHandle;
const VibrateElement = createIconElement(vibrateRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-vibrate": InstanceType<typeof VibrateElement>;
  }
}

if (!customElements.get("grave-vibrate")) {
  customElements.define("grave-vibrate", VibrateElement);
}
