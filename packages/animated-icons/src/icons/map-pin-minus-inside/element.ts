import { createIconElement } from "../../element";
import { mapPinMinusInsideRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinMinusInsideIconHandle = IconHandle;

const MapPinMinusInsideElement = createIconElement(mapPinMinusInsideRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin-minus-inside": InstanceType<typeof MapPinMinusInsideElement>;
  }
}

if (!customElements.get("grave-map-pin-minus-inside")) {
  customElements.define("grave-map-pin-minus-inside", MapPinMinusInsideElement);
}
