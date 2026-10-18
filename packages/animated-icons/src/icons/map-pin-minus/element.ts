import { createIconElement } from "../../element";
import { mapPinMinusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinMinusIconHandle = IconHandle;

const MapPinMinusElement = createIconElement(mapPinMinusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin-minus": InstanceType<typeof MapPinMinusElement>;
  }
}

if (!customElements.get("grave-map-pin-minus")) {
  customElements.define("grave-map-pin-minus", MapPinMinusElement);
}
