import { createIconElement } from "../../element";
import { arrowBigUpDashRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ArrowBigUpDashIconHandle = IconHandle;

const ArrowBigUpDashElement = createIconElement(arrowBigUpDashRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-arrow-big-up-dash": InstanceType<typeof ArrowBigUpDashElement>;
  }
}

if (!customElements.get("grave-arrow-big-up-dash")) {
  customElements.define("grave-arrow-big-up-dash", ArrowBigUpDashElement);
}
