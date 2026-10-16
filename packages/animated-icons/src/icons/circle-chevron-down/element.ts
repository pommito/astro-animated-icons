import { createIconElement } from "../../element";
import { circleChevronDownRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type CircleChevronDownIconHandle = IconHandle;

const CircleChevronDownElement = createIconElement(circleChevronDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-circle-chevron-down": InstanceType<typeof CircleChevronDownElement>;
  }
}

if (!customElements.get("grave-circle-chevron-down")) {
  customElements.define("grave-circle-chevron-down", CircleChevronDownElement);
}
