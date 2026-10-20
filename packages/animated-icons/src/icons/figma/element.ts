import { createIconElement, type IconHandle } from "../../element";
import { figmaRecipe } from "./definition";

export type FigmaIconHandle = IconHandle;
const FigmaElement = createIconElement(figmaRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-figma": InstanceType<typeof FigmaElement>;
  }
}

if (!customElements.get("grave-figma")) {
  customElements.define("grave-figma", FigmaElement);
}
