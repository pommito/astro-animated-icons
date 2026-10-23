import { createIconElement, type IconHandle } from "../../element";
import { bellElectricRecipe } from "./definition";

export type BellElectricIconHandle = IconHandle;

const BellElectricElement = createIconElement(bellElectricRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bell-electric": InstanceType<typeof BellElectricElement>;
  }
}

if (!customElements.get("grave-bell-electric")) {
  customElements.define("grave-bell-electric", BellElectricElement);
}
