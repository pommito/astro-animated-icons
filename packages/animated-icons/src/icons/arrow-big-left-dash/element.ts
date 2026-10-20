import { createIconElement } from "../../element";
import { arrowBigLeftDashRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowBigLeftDashIconHandle = IconHandle;

const ArrowBigLeftDashElement = createIconElement(arrowBigLeftDashRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-big-left-dash": InstanceType<typeof ArrowBigLeftDashElement>;
  }
}

if (!customElements.get("grave-arrow-big-left-dash")) {
  customElements.define("grave-arrow-big-left-dash", ArrowBigLeftDashElement);
}
