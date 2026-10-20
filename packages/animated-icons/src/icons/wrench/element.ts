import { createIconElement, type IconHandle } from "../../element";
import { wrenchRecipe } from "./definition";

export type WrenchIconHandle = IconHandle;
const WrenchElement = createIconElement(wrenchRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-wrench": InstanceType<typeof WrenchElement>;
  }
}

if (!customElements.get("grave-wrench")) {
  customElements.define("grave-wrench", WrenchElement);
}
