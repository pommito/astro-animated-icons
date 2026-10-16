import { createIconElement } from "../../element";
import { squareChevronLeftRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SquareChevronLeftIconHandle = IconHandle;

const SquareChevronLeftElement = createIconElement(squareChevronLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-chevron-left": InstanceType<typeof SquareChevronLeftElement>;
  }
}

if (!customElements.get("grave-square-chevron-left")) {
  customElements.define("grave-square-chevron-left", SquareChevronLeftElement);
}
