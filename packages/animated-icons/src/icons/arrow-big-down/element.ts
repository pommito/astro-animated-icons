import { createIconElement } from "../../element";
import { arrowBigDownRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowBigDownIconHandle = IconHandle;

const ArrowBigDownElement = createIconElement(arrowBigDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-big-down": InstanceType<typeof ArrowBigDownElement>;
  }
}

if (!customElements.get("grave-arrow-big-down")) {
  customElements.define("grave-arrow-big-down", ArrowBigDownElement);
}
