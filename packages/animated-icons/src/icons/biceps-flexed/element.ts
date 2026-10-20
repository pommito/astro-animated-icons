import { createIconElement, type IconHandle } from "../../element";
import { bicepsFlexedRecipe } from "./definition";

export type BicepsFlexedIconHandle = IconHandle;
const BicepsFlexedElement = createIconElement(bicepsFlexedRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-biceps-flexed": InstanceType<typeof BicepsFlexedElement>;
  }
}

if (!customElements.get("grave-biceps-flexed")) {
  customElements.define("grave-biceps-flexed", BicepsFlexedElement);
}
