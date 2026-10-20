import { createIconElement, type IconHandle } from "../../element";
import { cornerDownLeftRecipe } from "./definition";

export type CornerDownLeftIconHandle = IconHandle;

const CornerDownLeftElement = createIconElement(cornerDownLeftRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-corner-down-left": InstanceType<typeof CornerDownLeftElement>;
  }
}

if (!customElements.get("grave-corner-down-left")) {
  customElements.define("grave-corner-down-left", CornerDownLeftElement);
}
