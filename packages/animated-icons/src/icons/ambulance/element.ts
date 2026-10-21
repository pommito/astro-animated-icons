import { createIconElement, type IconHandle } from "../../element";
import { ambulanceRecipe } from "./definition";

export type AmbulanceIconHandle = IconHandle;
const AmbulanceElement = createIconElement(ambulanceRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-ambulance": InstanceType<typeof AmbulanceElement>;
  }
}

if (!customElements.get("grave-ambulance")) {
  customElements.define("grave-ambulance", AmbulanceElement);
}
