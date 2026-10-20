import { createIconElement, type IconHandle } from "../../element";
import { fishSymbolRecipe } from "./definition";

export type FishSymbolIconHandle = IconHandle;
const FishSymbolElement = createIconElement(fishSymbolRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-fish-symbol": InstanceType<typeof FishSymbolElement>;
  }
}

if (!customElements.get("grave-fish-symbol")) {
  customElements.define("grave-fish-symbol", FishSymbolElement);
}
