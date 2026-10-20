import { createIconElement, type IconHandle } from "../../element";
import { leafRecipe } from "./definition";

export type LeafIconHandle = IconHandle;
const LeafElement = createIconElement(leafRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-leaf": InstanceType<typeof LeafElement>;
  }
}

if (!customElements.get("grave-leaf")) {
  customElements.define("grave-leaf", LeafElement);
}
