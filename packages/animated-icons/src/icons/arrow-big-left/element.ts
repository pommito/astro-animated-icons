import { createIconElement } from "../../element";
import { arrowBigLeftRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowBigLeftIconHandle = IconHandle;

const ArrowBigLeftElement = createIconElement(arrowBigLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-big-left": InstanceType<typeof ArrowBigLeftElement>;
  }
}

if (!customElements.get("grave-arrow-big-left")) {
  customElements.define("grave-arrow-big-left", ArrowBigLeftElement);
}
