import { createIconElement, type IconHandle } from "../../element";
import { arrowDownZARecipe } from "./definition";

export type ArrowDownZAIconHandle = IconHandle;

const ArrowDownZAElement = createIconElement(arrowDownZARecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-down-z-a": InstanceType<typeof ArrowDownZAElement>;
  }
}

if (!customElements.get("grave-arrow-down-z-a")) {
  customElements.define("grave-arrow-down-z-a", ArrowDownZAElement);
}
