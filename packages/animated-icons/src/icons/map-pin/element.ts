import { createIconElement } from "../../element";
import { mapPinRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinIconHandle = IconHandle;

const MapPinElement = createIconElement(mapPinRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin": InstanceType<typeof MapPinElement>;
  }
}

if (!customElements.get("grave-map-pin")) {
  customElements.define("grave-map-pin", MapPinElement);
}
