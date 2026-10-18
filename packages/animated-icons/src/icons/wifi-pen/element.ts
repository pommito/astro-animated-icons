import { createIconElement } from "../../element";
import { wifiPenRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type WifiPenIconHandle = IconHandle;

const WifiPenElement = createIconElement(wifiPenRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-wifi-pen": InstanceType<typeof WifiPenElement>;
  }
}

if (!customElements.get("grave-wifi-pen")) {
  customElements.define("grave-wifi-pen", WifiPenElement);
}
