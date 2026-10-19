import { createIconElement } from "../../element";
import { bluetoothSearchingRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type BluetoothSearchingIconHandle = IconHandle;

const BluetoothSearchingElement = createIconElement(bluetoothSearchingRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bluetooth-searching": InstanceType<typeof BluetoothSearchingElement>;
  }
}

if (!customElements.get("grave-bluetooth-searching")) {
  customElements.define("grave-bluetooth-searching", BluetoothSearchingElement);
}
