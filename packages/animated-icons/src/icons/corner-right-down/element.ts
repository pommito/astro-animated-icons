import { createIconElement, type IconHandle } from "../../element";
import { cornerRightDownRecipe } from "./definition";

export type CornerRightDownIconHandle = IconHandle;

const CornerRightDownElement = createIconElement(cornerRightDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-corner-right-down": InstanceType<typeof CornerRightDownElement>;
  }
}

if (!customElements.get("grave-corner-right-down")) {
  customElements.define("grave-corner-right-down", CornerRightDownElement);
}
