import { createIconElement } from "../../element";
import { routerRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type RouterIconHandle = IconHandle;

const RouterElement = createIconElement(routerRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-router": InstanceType<typeof RouterElement>;
  }
}

if (!customElements.get("grave-router")) {
  customElements.define("grave-router", RouterElement);
}
