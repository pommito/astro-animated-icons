import { createIconElement } from "../../element";
import { chevronUpRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ChevronUpIconHandle = IconHandle;

const ChevronUpElement = createIconElement(chevronUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chevron-up": InstanceType<typeof ChevronUpElement>;
  }
}

if (!customElements.get("grave-chevron-up")) {
  customElements.define("grave-chevron-up", ChevronUpElement);
}
