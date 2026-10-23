import { createIconElement, type IconHandle } from "../../element";
import { shipWheelRecipe } from "./definition";

export type ShipWheelIconHandle = IconHandle;
const ShipWheelElement = createIconElement(shipWheelRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-ship-wheel": InstanceType<typeof ShipWheelElement>;
  }
}

if (!customElements.get("grave-ship-wheel")) {
  customElements.define("grave-ship-wheel", ShipWheelElement);
}
