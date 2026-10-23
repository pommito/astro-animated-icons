import { createIconElement, type IconHandle } from "../../element";
import { satelliteDishRecipe } from "./definition";

export type SatelliteDishIconHandle = IconHandle;
const SatelliteDishElement = createIconElement(satelliteDishRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-satellite-dish": InstanceType<typeof SatelliteDishElement>;
  }
}

if (!customElements.get("grave-satellite-dish")) {
  customElements.define("grave-satellite-dish", SatelliteDishElement);
}
