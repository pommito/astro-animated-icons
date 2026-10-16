import { createIconElement } from "../../element";
import { gripHorizontalRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GripHorizontalIconHandle = IconHandle;

const GripHorizontalElement = createIconElement(gripHorizontalRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-grip-horizontal": InstanceType<typeof GripHorizontalElement>;
  }
}

if (!customElements.get("grave-grip-horizontal")) {
  customElements.define("grave-grip-horizontal", GripHorizontalElement);
}
