import { createIconElement } from "../../element";
import { moonRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type MoonIconHandle = IconHandle;

const MoonElement = createIconElement(moonRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-moon": InstanceType<typeof MoonElement>;
  }
}

if (!customElements.get("grave-moon")) {
  customElements.define("grave-moon", MoonElement);
}
