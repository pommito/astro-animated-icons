import { createIconElement } from "../../element";
import { wifiCogRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type WifiCogIconHandle = IconHandle;

const WifiCogElement = createIconElement(wifiCogRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-wifi-cog": InstanceType<typeof WifiCogElement>;
  }
}

if (!customElements.get("grave-wifi-cog")) {
  customElements.define("grave-wifi-cog", WifiCogElement);
}
