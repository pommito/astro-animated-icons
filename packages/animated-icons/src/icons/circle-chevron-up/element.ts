import { createIconElement } from "../../element";
import { circleChevronUpRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type CircleChevronUpIconHandle = IconHandle;

const CircleChevronUpElement = createIconElement(circleChevronUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-circle-chevron-up": InstanceType<typeof CircleChevronUpElement>;
  }
}

if (!customElements.get("grave-circle-chevron-up")) {
  customElements.define("grave-circle-chevron-up", CircleChevronUpElement);
}
