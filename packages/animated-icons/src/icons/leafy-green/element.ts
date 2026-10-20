import { createIconElement, type IconHandle } from "../../element";
import { leafyGreenRecipe } from "./definition";

export type LeafyGreenIconHandle = IconHandle;
const LeafyGreenElement = createIconElement(leafyGreenRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-leafy-green": InstanceType<typeof LeafyGreenElement>;
  }
}

if (!customElements.get("grave-leafy-green")) {
  customElements.define("grave-leafy-green", LeafyGreenElement);
}
