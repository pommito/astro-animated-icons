import { createIconElement } from "../../element";
import { mapPinCheckRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinCheckIconHandle = IconHandle;

const MapPinCheckElement = createIconElement(mapPinCheckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin-check": InstanceType<typeof MapPinCheckElement>;
  }
}

if (!customElements.get("grave-map-pin-check")) {
  customElements.define("grave-map-pin-check", MapPinCheckElement);
}
