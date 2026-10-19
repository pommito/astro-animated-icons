import { createIconElement } from "../../element";
import { mapPinXInsideRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinXInsideIconHandle = IconHandle;

const MapPinXInsideElement = createIconElement(mapPinXInsideRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin-x-inside": InstanceType<typeof MapPinXInsideElement>;
  }
}

if (!customElements.get("grave-map-pin-x-inside")) {
  customElements.define("grave-map-pin-x-inside", MapPinXInsideElement);
}
