import { createIconElement, type IconHandle } from "../../element";
import { alignRightRecipe } from "./definition";

export type AlignRightIconHandle = IconHandle;

const AlignRightElement = createIconElement(alignRightRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-align-right": InstanceType<typeof AlignRightElement>;
  }
}

if (!customElements.get("grave-align-right")) {
  customElements.define("grave-align-right", AlignRightElement);
}
