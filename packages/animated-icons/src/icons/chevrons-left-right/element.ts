import { createIconElement } from "../../element";
import { chevronsLeftRightRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ChevronsLeftRightIconHandle = IconHandle;

const ChevronsLeftRightElement = createIconElement(chevronsLeftRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chevrons-left-right": InstanceType<typeof ChevronsLeftRightElement>;
  }
}

if (!customElements.get("grave-chevrons-left-right")) {
  customElements.define("grave-chevrons-left-right", ChevronsLeftRightElement);
}
