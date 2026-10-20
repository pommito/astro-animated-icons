import { createIconElement } from "../../element";
import { arrowBigDownDashRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowBigDownDashIconHandle = IconHandle;

const ArrowBigDownDashElement = createIconElement(arrowBigDownDashRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-big-down-dash": InstanceType<typeof ArrowBigDownDashElement>;
  }
}

if (!customElements.get("grave-arrow-big-down-dash")) {
  customElements.define("grave-arrow-big-down-dash", ArrowBigDownDashElement);
}
