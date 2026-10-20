import { createIconElement, type IconHandle } from "../../element";
import { paletteRecipe } from "./definition";

export type PaletteIconHandle = IconHandle;
const PaletteElement = createIconElement(paletteRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-palette": InstanceType<typeof PaletteElement>;
  }
}

if (!customElements.get("grave-palette")) {
  customElements.define("grave-palette", PaletteElement);
}
