import { createIconElement, type IconHandle } from "../../element";
import { alignHorizontalRecipe } from "./definition";

export type AlignHorizontalIconHandle = IconHandle;

const AlignHorizontalElement = createIconElement(alignHorizontalRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-align-horizontal": InstanceType<typeof AlignHorizontalElement>;
  }
}

if (!customElements.get("grave-align-horizontal")) {
  customElements.define("grave-align-horizontal", AlignHorizontalElement);
}
