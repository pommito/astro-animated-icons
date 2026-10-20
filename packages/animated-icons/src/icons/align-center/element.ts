import { createIconElement, type IconHandle } from "../../element";
import { alignCenterRecipe } from "./definition";

export type AlignCenterIconHandle = IconHandle;

const AlignCenterElement = createIconElement(alignCenterRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-align-center": InstanceType<typeof AlignCenterElement>;
  }
}

if (!customElements.get("grave-align-center")) {
  customElements.define("grave-align-center", AlignCenterElement);
}
