import { createIconElement, type IconHandle } from "../../element";
import { rollerCoasterRecipe } from "./definition";

export type RollerCoasterIconHandle = IconHandle;
const RollerCoasterElement = createIconElement(rollerCoasterRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-roller-coaster": InstanceType<typeof RollerCoasterElement>;
  }
}

if (!customElements.get("grave-roller-coaster")) {
  customElements.define("grave-roller-coaster", RollerCoasterElement);
}
