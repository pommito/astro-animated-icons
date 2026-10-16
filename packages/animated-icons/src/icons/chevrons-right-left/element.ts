import { createIconElement } from "../../element";
import { chevronsRightLeftRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ChevronsRightLeftIconHandle = IconHandle;

const ChevronsRightLeftElement = createIconElement(chevronsRightLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chevrons-right-left": InstanceType<typeof ChevronsRightLeftElement>;
  }
}

if (!customElements.get("grave-chevrons-right-left")) {
  customElements.define("grave-chevrons-right-left", ChevronsRightLeftElement);
}
