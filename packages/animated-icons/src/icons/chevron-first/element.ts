import { createIconElement } from "../../element";
import { chevronFirstRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ChevronFirstIconHandle = IconHandle;

const ChevronFirstElement = createIconElement(chevronFirstRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chevron-first": InstanceType<typeof ChevronFirstElement>;
  }
}

if (!customElements.get("grave-chevron-first")) {
  customElements.define("grave-chevron-first", ChevronFirstElement);
}
