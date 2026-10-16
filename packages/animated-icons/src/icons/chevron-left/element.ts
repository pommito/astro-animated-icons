import { createIconElement } from "../../element";
import { chevronLeftRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ChevronLeftIconHandle = IconHandle;

const ChevronLeftElement = createIconElement(chevronLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chevron-left": InstanceType<typeof ChevronLeftElement>;
  }
}

if (!customElements.get("grave-chevron-left")) {
  customElements.define("grave-chevron-left", ChevronLeftElement);
}
