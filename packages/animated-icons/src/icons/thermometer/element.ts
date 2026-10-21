import { createIconElement, type IconHandle } from "../../element";
import { thermometerRecipe } from "./definition";

export type ThermometerIconHandle = IconHandle;
const ThermometerElement = createIconElement(thermometerRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-thermometer": InstanceType<typeof ThermometerElement>;
  }
}

if (!customElements.get("grave-thermometer")) {
  customElements.define("grave-thermometer", ThermometerElement);
}
