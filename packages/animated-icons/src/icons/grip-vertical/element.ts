import { createIconElement } from "../../element";
import { gripVerticalRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type GripVerticalIconHandle = IconHandle;

const GripVerticalElement = createIconElement(gripVerticalRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-grip-vertical": InstanceType<typeof GripVerticalElement>;
  }
}

if (!customElements.get("grave-grip-vertical")) {
  customElements.define("grave-grip-vertical", GripVerticalElement);
}
