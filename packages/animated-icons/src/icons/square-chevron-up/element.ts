import { createIconElement } from "../../element";
import { squareChevronUpRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SquareChevronUpIconHandle = IconHandle;

const SquareChevronUpElement = createIconElement(squareChevronUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-chevron-up": InstanceType<typeof SquareChevronUpElement>;
  }
}

if (!customElements.get("grave-square-chevron-up")) {
  customElements.define("grave-square-chevron-up", SquareChevronUpElement);
}
