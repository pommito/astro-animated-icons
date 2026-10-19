import { createIconElement } from "../../element";
import { wifiSyncRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type WifiSyncIconHandle = IconHandle;

const WifiSyncElement = createIconElement(wifiSyncRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-wifi-sync": InstanceType<typeof WifiSyncElement>;
  }
}

if (!customElements.get("grave-wifi-sync")) {
  customElements.define("grave-wifi-sync", WifiSyncElement);
}
