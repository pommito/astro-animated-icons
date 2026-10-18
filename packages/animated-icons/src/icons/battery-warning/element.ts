import { createIconElement } from "../../element";
import { batteryWarningRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BatteryWarningIconHandle = IconHandle;

const BatteryWarningElement = createIconElement(batteryWarningRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-battery-warning": InstanceType<typeof BatteryWarningElement>;
  }
}

if (!customElements.get("grave-battery-warning")) {
  customElements.define("grave-battery-warning", BatteryWarningElement);
}
