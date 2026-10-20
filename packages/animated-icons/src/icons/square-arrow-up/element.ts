import { createIconElement, type IconHandle } from "../../element";
import { squareArrowUpRecipe } from "./definition";

export type SquareArrowUpIconHandle = IconHandle;

const SquareArrowUpElement = createIconElement(squareArrowUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-arrow-up": InstanceType<typeof SquareArrowUpElement>;
  }
}

if (!customElements.get("grave-square-arrow-up")) {
  customElements.define("grave-square-arrow-up", SquareArrowUpElement);
}
