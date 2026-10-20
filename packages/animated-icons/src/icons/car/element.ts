import { createIconElement, type IconHandle } from "../../element";
import { carRecipe } from "./definition";

export type CarIconHandle = IconHandle;

const CarElement = createIconElement(carRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-car": InstanceType<typeof CarElement>;
  }
}

if (!customElements.get("grave-car")) {
  customElements.define("grave-car", CarElement);
}
