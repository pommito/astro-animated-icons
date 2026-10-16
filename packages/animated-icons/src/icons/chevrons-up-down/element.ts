import { createIconElement } from "../../element";
import { chevronsUpDownRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type ChevronsUpDownIconHandle = IconHandle;

const ChevronsUpDownElement = createIconElement(chevronsUpDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-chevrons-up-down": InstanceType<typeof ChevronsUpDownElement>;
  }
}

if (!customElements.get("grave-chevrons-up-down")) {
  customElements.define("grave-chevrons-up-down", ChevronsUpDownElement);
}
