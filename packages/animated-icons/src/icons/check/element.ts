import { createIconElement } from "../../element";
import { checkRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type CheckIconHandle = IconHandle;

const CheckElement = createIconElement(checkRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-check": InstanceType<typeof CheckElement>;
  }
}

if (!customElements.get("grave-check")) {
  customElements.define("grave-check", CheckElement);
}
