import { createIconElement, type IconHandle } from "../../element";
import { languagesRecipe } from "./definition";

export type LanguagesIconHandle = IconHandle;

const LanguagesElement = createIconElement(languagesRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-languages": InstanceType<typeof LanguagesElement>;
  }
}

if (!customElements.get("grave-languages")) {
  customElements.define("grave-languages", LanguagesElement);
}
