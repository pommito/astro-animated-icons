import { createIconElement, type IconHandle } from "../../element";
import { squareArrowLeftRecipe } from "./definition";

export type SquareArrowLeftIconHandle = IconHandle;

const SquareArrowLeftElement = createIconElement(squareArrowLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-arrow-left": InstanceType<typeof SquareArrowLeftElement>;
  }
}

if (!customElements.get("grave-square-arrow-left")) {
  customElements.define("grave-square-arrow-left", SquareArrowLeftElement);
}
