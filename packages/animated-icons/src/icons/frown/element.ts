import { createIconElement, type IconHandle } from "../../element";
import { frownRecipe } from "./definition";

export type FrownIconHandle = IconHandle;
const FrownElement = createIconElement(frownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-frown": InstanceType<typeof FrownElement>;
  }
}

if (!customElements.get("grave-frown")) {
  customElements.define("grave-frown", FrownElement);
}
