import { createIconElement } from "../../element";
import { arrowUpRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowUpIconHandle = IconHandle;

const ArrowUpElement = createIconElement(arrowUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-up": InstanceType<typeof ArrowUpElement>;
  }
}

if (!customElements.get("grave-arrow-up")) {
  customElements.define("grave-arrow-up", ArrowUpElement);
}
