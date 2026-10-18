import { createIconElement } from "../../element";
import { compassRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type CompassIconHandle = IconHandle;

const CompassElement = createIconElement(compassRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-compass": InstanceType<typeof CompassElement>;
  }
}

if (!customElements.get("grave-compass")) {
  customElements.define("grave-compass", CompassElement);
}
