import { createIconElement } from "../../element";
import { chevronRightRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ChevronRightIconHandle = IconHandle;

const ChevronRightElement = createIconElement(chevronRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chevron-right": InstanceType<typeof ChevronRightElement>;
  }
}

if (!customElements.get("grave-chevron-right")) {
  customElements.define("grave-chevron-right", ChevronRightElement);
}
