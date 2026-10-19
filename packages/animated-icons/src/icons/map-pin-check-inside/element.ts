import { createIconElement } from "../../element";
import { mapPinCheckInsideRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinCheckInsideIconHandle = IconHandle;

const MapPinCheckInsideElement = createIconElement(mapPinCheckInsideRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin-check-inside": InstanceType<typeof MapPinCheckInsideElement>;
  }
}

if (!customElements.get("grave-map-pin-check-inside")) {
  customElements.define("grave-map-pin-check-inside", MapPinCheckInsideElement);
}
