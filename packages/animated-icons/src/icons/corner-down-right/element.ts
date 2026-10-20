import { createIconElement, type IconHandle } from "../../element";
import { cornerDownRightRecipe } from "./definition";

export type CornerDownRightIconHandle = IconHandle;

const CornerDownRightElement = createIconElement(cornerDownRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-corner-down-right": InstanceType<typeof CornerDownRightElement>;
  }
}

if (!customElements.get("grave-corner-down-right")) {
  customElements.define("grave-corner-down-right", CornerDownRightElement);
}
