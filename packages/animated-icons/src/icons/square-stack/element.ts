import { createIconElement, type IconHandle } from "../../element";
import { squareStackRecipe } from "./definition";

export type SquareStackIconHandle = IconHandle;

const SquareStackElement = createIconElement(squareStackRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-stack": InstanceType<typeof SquareStackElement>;
  }
}

if (!customElements.get("grave-square-stack")) {
  customElements.define("grave-square-stack", SquareStackElement);
}
