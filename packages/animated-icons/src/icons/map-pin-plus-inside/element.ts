import { createIconElement } from "../../element";
import { mapPinPlusInsideRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinPlusInsideIconHandle = IconHandle;

const MapPinPlusInsideElement = createIconElement(mapPinPlusInsideRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin-plus-inside": InstanceType<typeof MapPinPlusInsideElement>;
  }
}

if (!customElements.get("grave-map-pin-plus-inside")) {
  customElements.define("grave-map-pin-plus-inside", MapPinPlusInsideElement);
}
