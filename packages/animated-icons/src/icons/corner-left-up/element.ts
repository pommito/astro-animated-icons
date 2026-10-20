import { createIconElement, type IconHandle } from "../../element";
import { cornerLeftUpRecipe } from "./definition";

export type CornerLeftUpIconHandle = IconHandle;

const CornerLeftUpElement = createIconElement(cornerLeftUpRecipe);

declare global {
  interface HTMLElementTagNameMap {
    "grave-corner-left-up": InstanceType<typeof CornerLeftUpElement>;
  }
}

if (!customElements.get("grave-corner-left-up")) {
  customElements.define("grave-corner-left-up", CornerLeftUpElement);
}
