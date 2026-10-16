import { createIconElement } from "../../element";
import { chevronsDownUpRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ChevronsDownUpIconHandle = IconHandle;

const ChevronsDownUpElement = createIconElement(chevronsDownUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chevrons-down-up": InstanceType<typeof ChevronsDownUpElement>;
  }
}

if (!customElements.get("grave-chevrons-down-up")) {
  customElements.define("grave-chevrons-down-up", ChevronsDownUpElement);
}
