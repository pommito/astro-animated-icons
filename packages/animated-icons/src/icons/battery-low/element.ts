import { createIconElement } from "../../element";
import { batteryLowRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BatteryLowIconHandle = IconHandle;

const BatteryLowElement = createIconElement(batteryLowRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-battery-low": InstanceType<typeof BatteryLowElement>;
  }
}

if (!customElements.get("grave-battery-low")) {
  customElements.define("grave-battery-low", BatteryLowElement);
}
