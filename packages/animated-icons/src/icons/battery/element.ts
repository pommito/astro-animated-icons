import { createIconElement } from "../../element";
import { batteryRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BatteryIconHandle = IconHandle;

const BatteryElement = createIconElement(batteryRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-battery": InstanceType<typeof BatteryElement>;
  }
}

if (!customElements.get("grave-battery")) {
  customElements.define("grave-battery", BatteryElement);
}
