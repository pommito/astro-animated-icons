import { createIconElement } from "../../element";
import { batteryChargingRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BatteryChargingIconHandle = IconHandle;

const BatteryChargingElement = createIconElement(batteryChargingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-battery-charging": InstanceType<typeof BatteryChargingElement>;
  }
}

if (!customElements.get("grave-battery-charging")) {
  customElements.define("grave-battery-charging", BatteryChargingElement);
}
