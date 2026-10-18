import { createIconElement } from "../../element";
import { bluetoothConnectedRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BluetoothConnectedIconHandle = IconHandle;

const BluetoothConnectedElement = createIconElement(bluetoothConnectedRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bluetooth-connected": InstanceType<typeof BluetoothConnectedElement>;
  }
}

if (!customElements.get("grave-bluetooth-connected")) {
  customElements.define("grave-bluetooth-connected", BluetoothConnectedElement);
}
