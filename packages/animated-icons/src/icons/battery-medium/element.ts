import { createIconElement } from "../../element";
import { batteryMediumRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BatteryMediumIconHandle = IconHandle;

const BatteryMediumElement = createIconElement(batteryMediumRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-battery-medium": InstanceType<typeof BatteryMediumElement>;
  }
}

if (!customElements.get("grave-battery-medium")) {
  customElements.define("grave-battery-medium", BatteryMediumElement);
}
