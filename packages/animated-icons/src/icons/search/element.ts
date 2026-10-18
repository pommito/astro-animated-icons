import { createIconElement } from "../../element";
import { searchRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type SearchIconHandle = IconHandle;

const SearchElement = createIconElement(searchRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-search": InstanceType<typeof SearchElement>;
  }
}

if (!customElements.get("grave-search")) {
  customElements.define("grave-search", SearchElement);
}
