import { createIconElement } from "../../element";
import { mapPinPlusRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MapPinPlusIconHandle = IconHandle;

const MapPinPlusElement = createIconElement(mapPinPlusRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-map-pin-plus": InstanceType<typeof MapPinPlusElement>;
  }
}

if (!customElements.get("grave-map-pin-plus")) {
  customElements.define("grave-map-pin-plus", MapPinPlusElement);
}
