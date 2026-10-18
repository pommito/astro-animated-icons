import { createIconElement } from "../../element";
import { rotateCcwRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type RotateCcwIconHandle = IconHandle;

const RotateCcwElement = createIconElement(rotateCcwRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-rotate-ccw": InstanceType<typeof RotateCcwElement>;
  }
}

if (!customElements.get("grave-rotate-ccw")) {
  customElements.define("grave-rotate-ccw", RotateCcwElement);
}
