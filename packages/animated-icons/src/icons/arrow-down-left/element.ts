import { createIconElement } from "../../element";
import { arrowDownLeftRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowDownLeftIconHandle = IconHandle;

const ArrowDownLeftElement = createIconElement(arrowDownLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-down-left": InstanceType<typeof ArrowDownLeftElement>;
  }
}

if (!customElements.get("grave-arrow-down-left")) {
  customElements.define("grave-arrow-down-left", ArrowDownLeftElement);
}
