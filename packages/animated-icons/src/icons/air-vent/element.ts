import { createIconElement, type IconHandle } from "../../element";
import { airVentRecipe } from "./definition";

export type AirVentIconHandle = IconHandle;

const AirVentElement = createIconElement(airVentRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-air-vent": InstanceType<typeof AirVentElement>;
  }
}

if (!customElements.get("grave-air-vent")) {
  customElements.define("grave-air-vent", AirVentElement);
}
