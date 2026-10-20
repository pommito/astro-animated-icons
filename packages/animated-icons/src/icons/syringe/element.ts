import { createIconElement, type IconHandle } from "../../element";
import { syringeRecipe } from "./definition";

export type SyringeIconHandle = IconHandle;
const SyringeElement = createIconElement(syringeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-syringe": InstanceType<typeof SyringeElement>;
  }
}

if (!customElements.get("grave-syringe")) {
  customElements.define("grave-syringe", SyringeElement);
}
