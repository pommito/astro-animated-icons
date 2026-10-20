import { createIconElement } from "../../element";
import { arrowBigUpRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowBigUpIconHandle = IconHandle;

const ArrowBigUpElement = createIconElement(arrowBigUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-big-up": InstanceType<typeof ArrowBigUpElement>;
  }
}

if (!customElements.get("grave-arrow-big-up")) {
  customElements.define("grave-arrow-big-up", ArrowBigUpElement);
}
