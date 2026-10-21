import { createIconElement, type IconHandle } from "../../element";
import { maximizeRecipe } from "./definition";

export type MaximizeIconHandle = IconHandle;

const MaximizeElement = createIconElement(maximizeRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-maximize": InstanceType<typeof MaximizeElement>;
  }
}

if (!customElements.get("grave-maximize")) {
  customElements.define("grave-maximize", MaximizeElement);
}
