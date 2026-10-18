import { createIconElement } from "../../element";
import { rotateCwRecipe } from "./definition";
import type { IconHandle } from "../../element";

export type RotateCwIconHandle = IconHandle;

const RotateCwElement = createIconElement(rotateCwRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-rotate-cw": InstanceType<typeof RotateCwElement>;
  }
}

if (!customElements.get("grave-rotate-cw")) {
  customElements.define("grave-rotate-cw", RotateCwElement);
}
