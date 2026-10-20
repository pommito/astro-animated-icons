import { createIconElement, type IconHandle } from "../../element";
import { expandRecipe } from "./definition";

export type ExpandIconHandle = IconHandle;

const ExpandElement = createIconElement(expandRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-expand": InstanceType<typeof ExpandElement>;
  }
}

if (!customElements.get("grave-expand")) {
  customElements.define("grave-expand", ExpandElement);
}
