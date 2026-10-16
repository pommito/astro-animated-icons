import { createIconElement } from "../../element";
import { gripRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GripIconHandle = IconHandle;

const GripElement = createIconElement(gripRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-grip": InstanceType<typeof GripElement>;
  }
}

if (!customElements.get("grave-grip")) {
  customElements.define("grave-grip", GripElement);
}
