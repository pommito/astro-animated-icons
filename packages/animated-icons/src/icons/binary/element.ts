import { createIconElement, type IconHandle } from "../../element";
import { binaryRecipe } from "./definition";

export type BinaryIconHandle = IconHandle;

const BinaryElement = createIconElement(binaryRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-binary": InstanceType<typeof BinaryElement>;
  }
}

if (!customElements.get("grave-binary")) {
  customElements.define("grave-binary", BinaryElement);
}
