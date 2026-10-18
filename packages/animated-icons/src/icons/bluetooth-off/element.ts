import { createIconElement } from "../../element";
import { bluetoothOffRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BluetoothOffIconHandle = IconHandle;

const BluetoothOffElement = createIconElement(bluetoothOffRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bluetooth-off": InstanceType<typeof BluetoothOffElement>;
  }
}

if (!customElements.get("grave-bluetooth-off")) {
  customElements.define("grave-bluetooth-off", BluetoothOffElement);
}
