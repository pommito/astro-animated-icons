import { createIconElement } from "../../element";
import { circleChevronLeftRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type CircleChevronLeftIconHandle = IconHandle;

const CircleChevronLeftElement = createIconElement(circleChevronLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-circle-chevron-left": InstanceType<typeof CircleChevronLeftElement>;
  }
}

if (!customElements.get("grave-circle-chevron-left")) {
  customElements.define("grave-circle-chevron-left", CircleChevronLeftElement);
}
