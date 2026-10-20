import { createIconElement, type IconHandle } from "../../element";
import { bellRecipe } from "./definition";

export type BellIconHandle = IconHandle;

const BellElement = createIconElement(bellRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-bell": InstanceType<typeof BellElement>;
  }
}

if (!customElements.get("grave-bell")) {
  customElements.define("grave-bell", BellElement);
}
