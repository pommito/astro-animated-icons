import { createIconElement } from "../../element";
import { arrowBigRightDashRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowBigRightDashIconHandle = IconHandle;

const ArrowBigRightDashElement = createIconElement(arrowBigRightDashRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-big-right-dash": InstanceType<typeof ArrowBigRightDashElement>;
  }
}

if (!customElements.get("grave-arrow-big-right-dash")) {
  customElements.define("grave-arrow-big-right-dash", ArrowBigRightDashElement);
}
