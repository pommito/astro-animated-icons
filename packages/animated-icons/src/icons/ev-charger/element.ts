import { createIconElement, type IconHandle } from "../../element";
import { evChargerRecipe } from "./definition";

export type EvChargerIconHandle = IconHandle;
const EvChargerElement = createIconElement(evChargerRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-ev-charger": InstanceType<typeof EvChargerElement>;
  }
}

if (!customElements.get("grave-ev-charger")) {
  customElements.define("grave-ev-charger", EvChargerElement);
}
