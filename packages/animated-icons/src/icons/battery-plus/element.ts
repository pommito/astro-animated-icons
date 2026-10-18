import { createIconElement } from "../../element";
import { batteryPlusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BatteryPlusIconHandle = IconHandle;

const BatteryPlusElement = createIconElement(batteryPlusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-battery-plus": InstanceType<typeof BatteryPlusElement>;
  }
}

if (!customElements.get("grave-battery-plus")) {
  customElements.define("grave-battery-plus", BatteryPlusElement);
}
