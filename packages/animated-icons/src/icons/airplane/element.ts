import { createIconElement, type IconHandle } from "../../element";
import { airplaneRecipe } from "./definition";

export type AirplaneIconHandle = IconHandle;

const AirplaneElement = createIconElement(airplaneRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-airplane": InstanceType<typeof AirplaneElement>;
  }
}

if (!customElements.get("grave-airplane")) {
  customElements.define("grave-airplane", AirplaneElement);
}
