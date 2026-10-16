import { createIconElement } from "../../element";
import { arrowUpRightRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowUpRightIconHandle = IconHandle;

const ArrowUpRightElement = createIconElement(arrowUpRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-up-right": InstanceType<typeof ArrowUpRightElement>;
  }
}

if (!customElements.get("grave-arrow-up-right")) {
  customElements.define("grave-arrow-up-right", ArrowUpRightElement);
}
