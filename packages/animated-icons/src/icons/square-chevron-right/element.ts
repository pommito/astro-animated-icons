import { createIconElement } from "../../element";
import { squareChevronRightRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SquareChevronRightIconHandle = IconHandle;

const SquareChevronRightElement = createIconElement(squareChevronRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-chevron-right": InstanceType<typeof SquareChevronRightElement>;
  }
}

if (!customElements.get("grave-square-chevron-right")) {
  customElements.define("grave-square-chevron-right", SquareChevronRightElement);
}
