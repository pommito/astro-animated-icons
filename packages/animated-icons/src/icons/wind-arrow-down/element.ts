import { createIconElement } from "../../element";
import { windArrowDownRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type WindArrowDownIconHandle = IconHandle;

const WindArrowDownElement = createIconElement(windArrowDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-wind-arrow-down": InstanceType<typeof WindArrowDownElement>;
  }
}

if (!customElements.get("grave-wind-arrow-down")) {
  customElements.define("grave-wind-arrow-down", WindArrowDownElement);
}
