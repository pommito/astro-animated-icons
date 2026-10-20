import { createIconElement, type IconHandle } from "../../element";
import { minimizeRecipe } from "./definition";

export type MinimizeIconHandle = IconHandle;

const MinimizeElement = createIconElement(minimizeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-minimize": InstanceType<typeof MinimizeElement>;
  }
}

if (!customElements.get("grave-minimize")) {
  customElements.define("grave-minimize", MinimizeElement);
}
