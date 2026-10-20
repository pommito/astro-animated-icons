import { createIconElement, type IconHandle } from "../../element";
import { boldRecipe } from "./definition";

export type BoldIconHandle = IconHandle;

const BoldElement = createIconElement(boldRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bold": InstanceType<typeof BoldElement>;
  }
}

if (!customElements.get("grave-bold")) {
  customElements.define("grave-bold", BoldElement);
}
