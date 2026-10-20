import { createIconElement, type IconHandle } from "../../element";
import { cornerRightUpRecipe } from "./definition";

export type CornerRightUpIconHandle = IconHandle;

const CornerRightUpElement = createIconElement(cornerRightUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-corner-right-up": InstanceType<typeof CornerRightUpElement>;
  }
}

if (!customElements.get("grave-corner-right-up")) {
  customElements.define("grave-corner-right-up", CornerRightUpElement);
}
