import { createIconElement } from "../../element";
import { arrowDownRightRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowDownRightIconHandle = IconHandle;

const ArrowDownRightElement = createIconElement(arrowDownRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-down-right": InstanceType<typeof ArrowDownRightElement>;
  }
}

if (!customElements.get("grave-arrow-down-right")) {
  customElements.define("grave-arrow-down-right", ArrowDownRightElement);
}
