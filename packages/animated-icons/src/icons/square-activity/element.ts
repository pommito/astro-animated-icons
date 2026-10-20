import { createIconElement, type IconHandle } from "../../element";
import { squareActivityRecipe } from "./definition";

export type SquareActivityIconHandle = IconHandle;
const SquareActivityElement = createIconElement(squareActivityRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-square-activity": InstanceType<typeof SquareActivityElement>;
  }
}

if (!customElements.get("grave-square-activity")) {
  customElements.define("grave-square-activity", SquareActivityElement);
}
