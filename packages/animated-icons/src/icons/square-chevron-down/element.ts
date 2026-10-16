import { createIconElement } from "../../element";
import { squareChevronDownRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SquareChevronDownIconHandle = IconHandle;

const SquareChevronDownElement = createIconElement(squareChevronDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-chevron-down": InstanceType<typeof SquareChevronDownElement>;
  }
}

if (!customElements.get("grave-square-chevron-down")) {
  customElements.define("grave-square-chevron-down", SquareChevronDownElement);
}
