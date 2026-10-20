import { createIconElement, type IconHandle } from "../../element";
import { aArrowDownRecipe } from "./definition";

export type AArrowDownIconHandle = IconHandle;

const AArrowDownElement = createIconElement(aArrowDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-a-arrow-down": InstanceType<typeof AArrowDownElement>;
  }
}

if (!customElements.get("grave-a-arrow-down")) {
  customElements.define("grave-a-arrow-down", AArrowDownElement);
}
