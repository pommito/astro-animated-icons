import { createIconElement } from "../../element";
import { menuRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MenuIconHandle = IconHandle;

const MenuElement = createIconElement(menuRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-menu": InstanceType<typeof MenuElement>;
  }
}

if (!customElements.get("grave-menu")) {
  customElements.define("grave-menu", MenuElement);
}
