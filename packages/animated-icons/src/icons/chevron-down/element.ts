import { createIconElement } from "../../element";
import { chevronDownRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ChevronDownIconHandle = IconHandle;

const ChevronDownElement = createIconElement(chevronDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chevron-down": InstanceType<typeof ChevronDownElement>;
  }
}

if (!customElements.get("grave-chevron-down")) {
  customElements.define("grave-chevron-down", ChevronDownElement);
}
