import { createIconElement, type IconHandle } from "../../element";
import { atomRecipe } from "./definition";

export type AtomIconHandle = IconHandle;
const AtomElement = createIconElement(atomRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-atom": InstanceType<typeof AtomElement>;
  }
}

if (!customElements.get("grave-atom")) {
  customElements.define("grave-atom", AtomElement);
}
