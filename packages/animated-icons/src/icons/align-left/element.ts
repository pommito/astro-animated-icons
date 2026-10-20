import { createIconElement, type IconHandle } from "../../element";
import { alignLeftRecipe } from "./definition";

export type AlignLeftIconHandle = IconHandle;

const AlignLeftElement = createIconElement(alignLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-align-left": InstanceType<typeof AlignLeftElement>;
  }
}

if (!customElements.get("grave-align-left")) {
  customElements.define("grave-align-left", AlignLeftElement);
}
