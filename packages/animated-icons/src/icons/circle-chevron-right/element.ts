import { createIconElement } from "../../element";
import { circleChevronRightRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type CircleChevronRightIconHandle = IconHandle;

const CircleChevronRightElement = createIconElement(circleChevronRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-circle-chevron-right": InstanceType<typeof CircleChevronRightElement>;
  }
}

if (!customElements.get("grave-circle-chevron-right")) {
  customElements.define("grave-circle-chevron-right", CircleChevronRightElement);
}
