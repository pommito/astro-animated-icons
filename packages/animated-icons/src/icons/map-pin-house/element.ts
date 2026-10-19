import { createIconElement } from "../../element";
import { mapPinHouseRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinHouseIconHandle = IconHandle;

const MapPinHouseElement = createIconElement(mapPinHouseRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin-house": InstanceType<typeof MapPinHouseElement>;
  }
}

if (!customElements.get("grave-map-pin-house")) {
  customElements.define("grave-map-pin-house", MapPinHouseElement);
}
