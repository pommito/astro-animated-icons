import { createIconElement, type IconHandle } from "../../element";
import { cornerLeftDownRecipe } from "./definition";

export type CornerLeftDownIconHandle = IconHandle;

const CornerLeftDownElement = createIconElement(cornerLeftDownRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-corner-left-down": InstanceType<typeof CornerLeftDownElement>;
  }
}

if (!customElements.get("grave-corner-left-down")) {
  customElements.define("grave-corner-left-down", CornerLeftDownElement);
}
