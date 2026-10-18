import { createIconElement } from "../../element";
import { wifiLowRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type WifiLowIconHandle = IconHandle;

const WifiLowElement = createIconElement(wifiLowRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-wifi-low": InstanceType<typeof WifiLowElement>;
  }
}

if (!customElements.get("grave-wifi-low")) {
  customElements.define("grave-wifi-low", WifiLowElement);
}
