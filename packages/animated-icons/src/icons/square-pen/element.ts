import { createIconElement, type IconHandle } from "../../element";
import { squarePenRecipe } from "./definition";

export type SquarePenIconHandle = IconHandle;
const SquarePenElement = createIconElement(squarePenRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-pen": InstanceType<typeof SquarePenElement>;
  }
}

if (!customElements.get("grave-square-pen")) {
  customElements.define("grave-square-pen", SquarePenElement);
}
