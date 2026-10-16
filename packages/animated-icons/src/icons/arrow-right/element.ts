import { createIconElement } from "../../element";
import { arrowRightRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowRightIconHandle = IconHandle;

const ArrowRightElement = createIconElement(arrowRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-right": InstanceType<typeof ArrowRightElement>;
  }
}

if (!customElements.get("grave-arrow-right")) {
  customElements.define("grave-arrow-right", ArrowRightElement);
}
