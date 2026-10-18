import { createIconElement } from "../../element";
import { batteryFullRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BatteryFullIconHandle = IconHandle;

const BatteryFullElement = createIconElement(batteryFullRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-battery-full": InstanceType<typeof BatteryFullElement>;
  }
}

if (!customElements.get("grave-battery-full")) {
  customElements.define("grave-battery-full", BatteryFullElement);
}
