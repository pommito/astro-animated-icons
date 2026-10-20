import { createIconElement, type IconHandle } from "../../element";
import { italicRecipe } from "./definition";

export type ItalicIconHandle = IconHandle;

const ItalicElement = createIconElement(italicRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-italic": InstanceType<typeof ItalicElement>;
  }
}

if (!customElements.get("grave-italic")) {
  customElements.define("grave-italic", ItalicElement);
}
