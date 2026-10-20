import { createIconElement } from "../../element";
import { arrowBigRightRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowBigRightIconHandle = IconHandle;

const ArrowBigRightElement = createIconElement(arrowBigRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-big-right": InstanceType<typeof ArrowBigRightElement>;
  }
}

if (!customElements.get("grave-arrow-big-right")) {
  customElements.define("grave-arrow-big-right", ArrowBigRightElement);
}
