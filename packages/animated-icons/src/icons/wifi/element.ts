import { createIconElement } from "../../element";
import { wifiRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type WifiIconHandle = IconHandle;

const WifiElement = createIconElement(wifiRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-wifi": InstanceType<typeof WifiElement>;
  }
}

if (!customElements.get("grave-wifi")) {
  customElements.define("grave-wifi", WifiElement);
}
