import { createIconElement, type IconHandle } from "../../element";
import { underlineRecipe } from "./definition";

export type UnderlineIconHandle = IconHandle;

const UnderlineElement = createIconElement(underlineRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-underline": InstanceType<typeof UnderlineElement>;
  }
}

if (!customElements.get("grave-underline")) {
  customElements.define("grave-underline", UnderlineElement);
}
