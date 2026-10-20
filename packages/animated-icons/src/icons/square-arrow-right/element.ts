import { createIconElement, type IconHandle } from "../../element";
import { squareArrowRightRecipe } from "./definition";

export type SquareArrowRightIconHandle = IconHandle;

const SquareArrowRightElement = createIconElement(squareArrowRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-arrow-right": InstanceType<typeof SquareArrowRightElement>;
  }
}

if (!customElements.get("grave-square-arrow-right")) {
  customElements.define("grave-square-arrow-right", SquareArrowRightElement);
}
