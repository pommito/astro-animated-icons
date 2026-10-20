import { createIconElement, type IconHandle } from "../../element";
import { arrowDownAZRecipe } from "./definition";

export type ArrowDownAZIconHandle = IconHandle;

const ArrowDownAZElement = createIconElement(arrowDownAZRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-down-a-z": InstanceType<typeof ArrowDownAZElement>;
  }
}

if (!customElements.get("grave-arrow-down-a-z")) {
  customElements.define("grave-arrow-down-a-z", ArrowDownAZElement);
}
