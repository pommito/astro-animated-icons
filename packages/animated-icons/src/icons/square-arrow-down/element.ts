import { createIconElement, type IconHandle } from "../../element";
import { squareArrowDownRecipe } from "./definition";

export type SquareArrowDownIconHandle = IconHandle;

const SquareArrowDownElement = createIconElement(squareArrowDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-arrow-down": InstanceType<typeof SquareArrowDownElement>;
  }
}

if (!customElements.get("grave-square-arrow-down")) {
  customElements.define("grave-square-arrow-down", SquareArrowDownElement);
}
