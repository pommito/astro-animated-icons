import { createIconElement } from "../../element";
import { bluetoothRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BluetoothIconHandle = IconHandle;

const BluetoothElement = createIconElement(bluetoothRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bluetooth": InstanceType<typeof BluetoothElement>;
  }
}

if (!customElements.get("grave-bluetooth")) {
  customElements.define("grave-bluetooth", BluetoothElement);
}
