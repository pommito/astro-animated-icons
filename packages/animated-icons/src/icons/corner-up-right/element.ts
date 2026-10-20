import { createIconElement, type IconHandle } from "../../element";
import { cornerUpRightRecipe } from "./definition";

export type CornerUpRightIconHandle = IconHandle;

const CornerUpRightElement = createIconElement(cornerUpRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-corner-up-right": InstanceType<typeof CornerUpRightElement>;
  }
}

if (!customElements.get("grave-corner-up-right")) {
  customElements.define("grave-corner-up-right", CornerUpRightElement);
}
