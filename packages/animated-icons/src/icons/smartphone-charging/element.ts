import { createIconElement, type IconHandle } from "../../element";
import { smartphoneChargingRecipe } from "./definition";

export type SmartphoneChargingIconHandle = IconHandle;
const SmartphoneChargingElement = createIconElement(smartphoneChargingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-smartphone-charging": InstanceType<typeof SmartphoneChargingElement>;
  }
}

if (!customElements.get("grave-smartphone-charging")) {
  customElements.define("grave-smartphone-charging", SmartphoneChargingElement);
}
