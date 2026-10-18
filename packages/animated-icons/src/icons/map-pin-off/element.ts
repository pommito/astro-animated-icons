import { createIconElement } from "../../element";
import { mapPinOffRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinOffIconHandle = IconHandle;

const MapPinOffElement = createIconElement(mapPinOffRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin-off": InstanceType<typeof MapPinOffElement>;
  }
}

if (!customElements.get("grave-map-pin-off")) {
  customElements.define("grave-map-pin-off", MapPinOffElement);
}
