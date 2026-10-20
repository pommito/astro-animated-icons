import { createIconElement, type IconHandle } from "../../element";
import { truckRecipe } from "./definition";

export type TruckIconHandle = IconHandle;

const TruckElement = createIconElement(truckRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-truck": InstanceType<typeof TruckElement>;
  }
}

if (!customElements.get("grave-truck")) {
  customElements.define("grave-truck", TruckElement);
}
